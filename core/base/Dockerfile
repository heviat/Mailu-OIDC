# syntax=docker/dockerfile-upstream:1.4.3

# base system image (intermediate)
# Note when updating the alpine tag, first manually run the workflow .github/workflows/mirror.yml.
# Just run the workflow with the tag that must be synchronised.
ARG DISTRO=ghcr.io/mailu/alpine:3.20.3
FROM $DISTRO as system

ENV TZ=Etc/UTC LANG=C.UTF-8

ARG MAILU_UID=1000
ARG MAILU_GID=1000

RUN set -euxo pipefail
RUN addgroup -Sg ${MAILU_GID} mailu
RUN adduser -Sg ${MAILU_UID} -G mailu -h /app -g "mailu app" -s /bin/bash mailu
RUN apk add --no-cache bash ca-certificates curl python3 tzdata
RUN ! [[ "$(uname -m)" == x86_64 ]] \
    || apk add --no-cache --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing hardened-malloc

WORKDIR /app

CMD /bin/bash


# build virtual env (intermediate)
FROM system as build

ARG MAILU_DEPS=prod
ARG SNUFFLEUPAGUS_VERSION=0.10.0

ENV VIRTUAL_ENV=/app/venv

COPY requirements-build.txt ./

RUN set -euxo pipefail 
RUN apk add --no-cache py3-pip
RUN python3 -m venv ${VIRTUAL_ENV}
RUN ${VIRTUAL_ENV}/bin/pip install --no-cache-dir -r requirements-build.txt
RUN apk del -r py3-pip
RUN rm -f /tmp/*.pem

COPY requirements-${MAILU_DEPS}.txt ./
COPY libs/ libs/

ENV \
  PATH="${VIRTUAL_ENV}/bin:${PATH}" \
  CXXFLAGS="-g -O2 -fdebug-prefix-map=/app=. -fstack-protector-strong -Wformat -Werror=format-security -fstack-clash-protection -fexceptions" \
  CFLAGS="-g -O2 -fdebug-prefix-map=/app=. -fstack-protector-strong -Wformat -Werror=format-security -fstack-clash-protection -fexceptions" \
  CPPFLAGS="-Wdate-time -D_FORTIFY_SOURCE=2" \
  LDFLAGS="-Wl,-z,noexecstack -Wl,-z,relro -Wl,-z,now" \
  SNUFFLEUPAGUS_URL="https://github.com/jvoisin/snuffleupagus/archive/refs/tags/v${SNUFFLEUPAGUS_VERSION}.tar.gz"

RUN set -euxo pipefail
RUN MACHINE="$(uname -m)"
RUN DEPS="build-base gcc libffi-dev python3-dev"
RUN if [ -e ${MACHINE} != x86_64 ]; then DEPS="${DEPS} cargo git libretls-dev mariadb-connector-c-dev postgresql-dev"; fi
RUN apk add --no-cache --virtual .build-deps ${DEPS}
RUN if [ -e ${MACHINE} = armv7* ]; then \
      mkdir -p /root/.cargo/registry/index && \
      git clone --bare https://github.com/rust-lang/crates.io-index.git /root/.cargo/registry/index/github.com-1285ae84e5963aae; fi
RUN pip install -r requirements-${MAILU_DEPS}.txt
RUN curl --proto "=https" -sL ${SNUFFLEUPAGUS_URL} | tar xz
RUN mv snuffleupagus-${SNUFFLEUPAGUS_VERSION} snuffleupagus
WORKDIR /app/snuffleupagus
RUN rm -rf src/tests/*php7*/ src/tests/*session*/ src/tests/broken_configuration/ src/tests/*cookie* src/tests/upload_validation/
RUN apk add --virtual .build-deps php83-dev php83-cgi php83-simplexml php83-xml pcre-dev build-base php83-pear php83-openssl re2c
RUN pecl83 install vld-beta
RUN make -j $(grep -c processor /proc/cpuinfo) release
RUN cp src/.libs/snuffleupagus.so /app
RUN rm -rf /root/.cargo /tmp/*.pem /root/.cache

# base mailu image
FROM system

COPY --from=build /app/venv/ /app/venv/
COPY --chown=root:root --from=build /app/snuffleupagus.so /usr/lib/php83/modules/

ENV \
  VIRTUAL_ENV=/app/venv \
  PATH="/app/venv/bin:${PATH}" \
  ADMIN_ADDRESS="admin" \
  FRONT_ADDRESS="front" \
  FTS_ATTACHMENTS_ADDRESS="tika" \
  SMTP_ADDRESS="smtp" \
  IMAP_ADDRESS="imap" \
  OLETOOLS_ADDRESS="oletools" \
  REDIS_ADDRESS="redis" \
  ANTIVIRUS_ADDRESS="antivirus" \
  ANTISPAM_ADDRESS="antispam" \
  WEBMAIL_ADDRESS="webmail" \
  WEBDAV_ADDRESS="webdav"
