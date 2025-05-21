import os
import sys
import pytest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from database import db_session, Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:")


@pytest.fixture(scope='session')
def app():
    os.environ["DATABASE_URL"] = TEST_DATABASE_URL

    app = create_app()

    engine = create_engine(TEST_DATABASE_URL)
    TestingSession = sessionmaker(bind=engine)
    db_session.configure(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield app

    Base.metadata.drop_all(bind=engine)
    db_session.remove()

@pytest.fixture(scope='session')
def client(app):
    return app.test_client()