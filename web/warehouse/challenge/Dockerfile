FROM python:3

RUN ["apt", "update", "-y"]

RUN ["apt", "install", "sqlite3", "-y"]

COPY ./app /app

COPY entrypoint.sh /

WORKDIR /app

RUN ["pip", "install", "-r", "/app/requirements.txt"]

ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]