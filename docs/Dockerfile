# Convert .rst files to .html in temporary build container
FROM python:3.12.3-alpine3.19 AS build

ARG version=master
ENV VERSION=$version

COPY requirements.txt /requirements.txt
COPY . /docs

RUN set -euxo pipefail
ENV MACHINE="$(uname -m)"
ENV DEPS="gcc musl-dev graphviz"
RUN if [ -e ${MACHINE} != x86_64 ]; then DEPS="${DEPS} cargo"; fi
RUN apk add --no-cache --virtual .build-deps $DEPS
RUN if [ -e ${MACHINE} = armv7* ]; then \
      mkdir -p /root/.cargo/registry/index && \
      git clone --bare https://github.com/rust-lang/crates.io-index.git /root/.cargo/registry/index/github.com-1285ae84e5963aae; fi
RUN pip3 install -r /requirements.txt
RUN mkdir -p /build/$VERSION
RUN dot -Tsvg /docs/mailu-network-diagram.dot -o /docs/contributors/mailu-network-diagram.svg
RUN sphinx-build -W /docs /build/$VERSION
RUN apk del .build-deps
RUN rm -rf /root/.cargo

# Build nginx deployment image including generated html
FROM nginx:1.25.5-alpine

ARG version=master
ARG pinned_version=master
ENV VERSION=$version
ENV TZ=Etc/UTC
LABEL version=$VERSION

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/$VERSION /build/$VERSION

EXPOSE 80/tcp

CMD nginx -g "daemon off;"
RUN echo $pinned_version >> /version
