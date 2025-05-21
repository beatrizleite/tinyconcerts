import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    FLASK_RUN_HOST = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    FLASK_RUN_PORT = os.getenv("FLASK_RUN_PORT", 5000)

class DevConfig(config):
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

class TestConfig(config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:")

