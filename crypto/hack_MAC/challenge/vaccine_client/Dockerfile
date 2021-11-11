# Dockerfile to build for Linux

FROM rust:1.53-buster

WORKDIR /build

COPY . .

RUN cargo build --release
