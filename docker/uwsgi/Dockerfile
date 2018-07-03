FROM alpine:3.7

ADD . /app

WORKDIR /app

RUN \
    apk add --update python3 uwsgi uwsgi-python3 && \
    pip3 install --upgrade pip && \
    pip3 install -r /app/docker/nginx/requirements.txt

EXPOSE 3031

CMD ["uwsgi", "--ini", "/app/pastitude.ini", "--plugin", "python3"]