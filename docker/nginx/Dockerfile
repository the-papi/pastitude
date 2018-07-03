FROM alpine:3.7

ADD . /app

WORKDIR /app

RUN \
    apk add --update nginx

# Clear default configurations
RUN \
    rm /etc/nginx/conf.d/default.conf && \
    mkdir -p /run/nginx && \
    ln -s /dev/stderr /var/log/nginx/error.log && \
    ln -s /dev/stdout /var/log/nginx/access.log

COPY docker/nginx/application.conf /etc/nginx/conf.d/application.conf

COPY docker/nginx/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]