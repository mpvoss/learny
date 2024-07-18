
import logging
import os

from dotenv import load_dotenv


def load_deploy_env():
    env = os.getenv('ENV')
    print('Initializing env, ENV=' + str(env) + '...')

    # In AWS env vars set by TF
    if env is None:
        pass
    elif env == 'LOCAL':
        load_dotenv('.env.local')
    elif env == 'LOCAL_DOCKER':
        load_dotenv('.env.localdocker')
    elif env == 'PROD':
        load_dotenv('.env.prod')
    else:
        raise Exception('Invalid environment: ' + env)


def build_db_url():

    env = os.getenv('ENV')
    if env == 'LOCAL_DOCKER':
        db_path = os.environ['DB_PATH']
        return f"sqlite:///{db_path}"
    else:
        db_host = os.environ['DB_HOST']
        db_port = os.environ['DB_PORT']
        db_name = os.environ['DB_NAME']
        db_pass = os.environ['DB_PASS']
        db_user = os.environ['DB_USER']

        return f"postgresql://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}"