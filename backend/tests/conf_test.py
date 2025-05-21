import pytest
from app import app
from database import db_session, init_db 
from config import TestConfig

@pytest.fixture
def app():
    test_db_url = "sqlite:///:memory:"
    init_db(test_db_url)

    yield flask_app

    drop_db()

@pytest.fixture
def client(app):
    return app.test_client()    