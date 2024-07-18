#!/bin/sh

export ENV=LOCAL_DOCKER

alembic upgrade head

uvicorn main:app --host 0.0.0.0