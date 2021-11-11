#!/bin/bash

./vaccine_client 127.0.0.1 1337 kajfkafj "help"

./vaccine_client 127.0.0.1 1337 kajf "help"

./vaccine_client 127.0.0.1 1337 jessie "help"

./vaccine_client 127.0.0.1 1337 jessie "list_vaccines"

./vaccine_client 127.0.0.1 1337 jessie "add_vaccine hey"

./vaccine_client 127.0.0.1 1337 jessie "remove_vaccine morderna"

./vaccine_client 127.0.0.1 1337 jessie "list_vaccines"

