#!/bin/bash

export APP_ENV=$1
op inject -i "./.env.1p" -o "./.env" -f
printf "Environment $1 variables injected into .env file.\n"
