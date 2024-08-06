#!/bin/sh

export ENV=LOCAL_DOCKER

alembic upgrade head

mkdir -p /learny_vol/logs
uvicorn main:app --host 0.0.0.0 --log-config /uvicorn.ini