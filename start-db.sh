#!/usr/bin/env bash
# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS:
# 1. Don't run on windows. Just open the bash tab.

# On Linux and macOS you can run this script directly - `./start-database.sh`

# place this in .env: DATABASE_URL=postgresql://postgres:password@localhost:5432/starter-kit
DB_CONTAINER_NAME="starter-kit"

if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' already running"
  exit 0
fi

if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Existing database container '$DB_CONTAINER_NAME' started"
  exit 0
fi

# import env variables from .env
set -a
source .env

# Extract components from DATABASE_URL
PROTO="$(echo $DATABASE_URL | grep :// | sed -e's,^\(.*://\).*,\1,g')"
URL="$(echo ${DATABASE_URL/$PROTO/})"
USERPASS="$(echo $URL | grep @ | cut -d@ -f1)"
HOSTPORT="$(echo ${URL/$USERPASS@/} | cut -d/ -f1)"
DB_HOST="$(echo $HOSTPORT | cut -d: -f1)"
DB_PORT="$(echo $HOSTPORT | cut -d: -f2)"
DB_USER="$(echo $USERPASS | cut -d: -f1)"
DB_PASSWORD="$(echo $USERPASS | cut -d: -f2)"

# Debugging information
echo "Extracted DB_HOST: $DB_HOST"
echo "Extracted DB_PORT: $DB_PORT"
echo "Extracted DB_USER: $DB_USER"
echo "Extracted DB_PASSWORD: $DB_PASSWORD"

if [ "$DB_PASSWORD" = "password" ]; then
  echo "You are using the default database password"
  read -p "Should we generate a random password for you? [y/N]: " -r REPLY
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Generate a random URL-safe password
    DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
    sed -i -e "s#:password@#:$DB_PASSWORD@#" .env
  else
    echo "Please set a password in the .env file and try again"
    exit 1
  fi
fi

echo "Starting on port $DB_PORT"

docker run -d \
  --name $DB_CONTAINER_NAME \
  -e POSTGRES_USER="$DB_USER" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_CONTAINER_NAME" \
  -p "$DB_PORT:5432" \
  docker.io/postgres && echo "Database container '$DB_CONTAINER_NAME' was successfully created"
