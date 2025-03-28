# syntax=docker/dockerfile-upstream:1.4.3

FROM base

ARG VERSION
LABEL version=$VERSION

COPY snappymail/pubkey.asc /tmp/snappymail.asc
COPY roundcube/pubkey.asc /tmp/roundcube.asc
COPY roundcube/roundcube.diff /tmp/roundcube.diff

# php83-pecl-imagick php83-pecl-uuid are missing
RUN set -euxo pipefail
RUN apk add --no-cache \
    nginx gpg gpg-agent patch \
    php83 php83-fpm php83-mbstring php83-zip php83-xml php83-simplexml php83-pecl-apcu \
    php83-dom php83-curl php83-exif gd php83-gd php83-iconv php83-intl php83-openssl php83-ctype \
    php83-pdo_sqlite php83-pdo_mysql php83-pdo_pgsql php83-pdo php83-sodium libsodium php83-tidy \
    php83-pspell php83-opcache php83-session php83-sockets php83-fileinfo php83-xmlreader php83-xmlwriter \
    aspell-uk aspell-ru aspell-fr aspell-de aspell-en
RUN rm /etc/nginx/http.d/default.conf
RUN rm /etc/php83/php-fpm.d/www.conf 
RUN mkdir -m 700 /root/.gnupg/
RUN gpg --import /tmp/snappymail.asc
RUN gpg --import /tmp/roundcube.asc
RUN echo extension=snuffleupagus > /etc/php83/conf.d/snuffleupagus.ini
RUN rm -f /tmp/roundcube.asc /tmp/snappymail.asc
RUN mkdir -p /run/nginx /conf

# roundcube
ENV ROUNDCUBE_URL=https://github.com/roundcube/roundcubemail/releases/download/1.6.9/roundcubemail-1.6.9-complete.tar.gz
ENV CARDDAV_URL=https://github.com/mstilkerich/rcmcarddav/releases/download/v5.1.0/carddav-v5.1.0.tar.gz

RUN set -euxo pipefail
WORKDIR /var/www
RUN curl -sLo /tmp/roundcube.tgz ${ROUNDCUBE_URL}
RUN curl -sLo /tmp/roundcube.tgz.asc ${ROUNDCUBE_URL}.asc
RUN gpg --status-fd 1 --verify /tmp/roundcube.tgz.asc /tmp/roundcube.tgz
RUN tar xzf /tmp/roundcube.tgz
RUN curl -sL ${CARDDAV_URL} | tar xz
RUN mv roundcubemail-* roundcube
RUN mkdir -p /var/www/roundcube/config
RUN mv carddav roundcube/plugins/
WORKDIR /var/www/roundcube
RUN rm -rf CHANGELOG.md SECURITY.md INSTALL LICENSE README.md UPGRADING composer.json-dist installer composer.*
RUN ln -sf index.php /var/www/roundcube/public_html/sso.php
RUN rm -rf plugins/{autologon,example_addressbook,http_authentication,krb_authentication,new_user_identity,password,redundant_attachments,squirrelmail_usercopy,userinfo,virtuser_file,virtuser_query}
RUN patch -p0 < /tmp/roundcube.diff
RUN rm /tmp/roundcube.diff

COPY roundcube/config/config.inc.php /conf/
COPY roundcube/login/ /var/www/roundcube/plugins/mailu/
COPY roundcube/config/config.inc.carddav.php /var/www/roundcube/plugins/carddav/config.inc.php

# snappymail

ENV SNAPPYMAIL_URL=https://github.com/the-djmaze/snappymail/releases/download/v2.38.2/snappymail-2.38.2.tar.gz

RUN set -euxo pipefail
RUN mkdir /var/www/snappymail
WORKDIR /var/www/snappymail
RUN curl -sLo /tmp/snappymail.tgz  ${SNAPPYMAIL_URL}
RUN curl -sLo /tmp/snappymail.tgz.asc  ${SNAPPYMAIL_URL}.asc
RUN gpg --status-fd 1 --verify /tmp/snappymail.tgz.asc /tmp/snappymail.tgz
RUN cat /tmp/snappymail.tgz | tar xz

# SnappyMail login
COPY snappymail/login/include.php /var/www/snappymail/
COPY snappymail/login/sso.php /var/www/snappymail/

# Parsed and moved at startup
COPY snappymail/defaults/application.ini /defaults/
COPY snappymail/defaults/default.json /defaults/

# set perms
RUN set -euxo pipefail
RUN chmod -R a+rX /var/www/snappymail
RUN chown -R root:root /var/www/snappymail
RUN chown -R mailu:mailu /var/www/snappymail/data
RUN chown -R root:root /var/www/roundcube/
RUN chown -R mailu:mailu /var/www/roundcube/temp /var/www/roundcube/logs
RUN chmod -R a+rX /var/www/roundcube

# common
COPY start.py /
COPY php.ini /defaults/
COPY php-webmail.conf /etc/php83/php-fpm.d/
COPY nginx-webmail.conf /conf/
COPY snuffleupagus.rules /etc/snuffleupagus.rules.tpl

# EXPOSE 80/tcp
VOLUME /data
VOLUME /overrides

CMD /start.py

HEALTHCHECK CMD curl -m3 -f -L http://localhost/ping || exit 1

RUN echo $VERSION >> /version
