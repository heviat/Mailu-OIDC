# syntax=docker/dockerfile-upstream:1.4.3

# fetchmail image
FROM base

ARG VERSION=local
LABEL version=$VERSION

RUN set -euxo pipefail
RUN apk add --no-cache fetchmail openssl
RUN mkdir -p /data

COPY fetchmail.py /

RUN echo $VERSION >/version

HEALTHCHECK --start-period=350s CMD ["/bin/sh", "-c", "ps ax | grep [/]fetchmail.py"]

CMD ["/fetchmail.py"]
