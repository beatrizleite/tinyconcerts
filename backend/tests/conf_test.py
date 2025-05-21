import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from app import create_app
from database import Base, db_session

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///:memory:")

@pytest.fixture(scope='session')
def engine():
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)
    engine.dispose()

@pytest.fixture(scope='session')
def session_factory(engine):
    return sessionmaker(bind=engine)

@pytest.fixture(scope='function')
def db_session(session_factory):
    """Creates a new database session for a test."""
    session = scoped_session(session_factory)
    db_session.configure(bind=session.bind)
    yield session
    session.remove()

@pytest.fixture(scope='function')
def app(db_session):
    """Create a Flask app configured for testing."""
    test_config = {
        'TESTING': True,
        'DATABASE_URL': TEST_DATABASE_URL,
    }
    app = create_app(test_config)
    yield app

@pytest.fixture(scope='function')
def client(app):
    """Flask test client."""
    return app.test_client()
