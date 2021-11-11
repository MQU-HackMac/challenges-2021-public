#!/bin/bash

cd /challenge

mkdir -p /root/.local/share/
cp -r ./caddy /root/.local/share/caddy

caddy start

yarn network &
yarn compile:contracts
yarn deploy:contracts
SKIP_PREFLIGHT_CHECK=true yarn start:hackmac
