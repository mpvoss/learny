from dotenv import find_dotenv, load_dotenv
import pytest


@pytest.fixture(scope='session', autouse=True)
def load_env():
    env_file = find_dotenv('.env.test')
    load_dotenv(env_file)
