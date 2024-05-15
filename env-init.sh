#!/bin/bash

if [ -z $1 ]; then
  echo "Usage: pnpm env:init dev-<your_name>"
  exit
else
  export APP_ENV=$1
  op inject -i "./.env.1p" -o "./.env" -f
  printf "Environment $1 variables injected into .env file.\n"
fi

