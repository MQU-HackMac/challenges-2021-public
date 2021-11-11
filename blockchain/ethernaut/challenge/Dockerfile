FROM ubuntu

RUN apt-get update && apt-get install -y git vim curl

# Install node and npm
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get update && apt-get install -y nodejs

# Install ganache-cli
RUN npm install -g ganache-cli yarn

# Install caddy
RUN apt-get install -y debian-keyring debian-archive-keyring apt-transport-https \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | tee /etc/apt/trusted.gpg.d/caddy-stable.asc \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt-get update \
    && apt-get install -y caddy

WORKDIR /challenge

COPY ./contracts/package.json ./contracts/package.json
COPY ./client/package.json ./client/package.json
COPY ./deps/hljs/package.json ./deps/hljs/package.json
COPY ./package.json .

RUN npm install --verbose

COPY . .

CMD bash entrypoint.sh
