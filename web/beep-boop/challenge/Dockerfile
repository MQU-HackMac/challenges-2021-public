FROM python:3

COPY ./app /app

COPY entrypoint.sh /

WORKDIR /app

RUN ["pip", "install", "-r", "/app/requirements.txt"]

ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]