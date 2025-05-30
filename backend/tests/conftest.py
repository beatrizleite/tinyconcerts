import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from app import create_app
from database import Base, db_session
from flask_jwt_extended import create_access_token
from models.user import User  # adjust import path to your User model
from werkzeug.security import generate_password_hash
from datetime import date

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
def test_db_session(session_factory):
    session = scoped_session(session_factory)
    db_session.configure(bind=session.bind)  # configure global scoped session
    yield session
    session.remove()


@pytest.fixture(scope='function')
def app(test_db_session):
    """Create a Flask app configured for testing."""
    test_config = {
        'TESTING': True,
        'DATABASE_URL': TEST_DATABASE_URL,
    }
    app = create_app(test_config)
    yield app


@pytest.fixture(scope='function')
def test_user(test_db_session):
    """Create a test user in the database."""
    user = User(
        username="testuser",
        email="test@example.com",
        fname="Test",
        lname="User",
        birthday=date(1990, 1, 1),
        password_hash=generate_password_hash("secret123"),
        role=1
    )
    test_db_session.add(user)
    test_db_session.commit()
    return user


@pytest.fixture(scope='function')
def access_token(app, test_user):
    """Generate a valid JWT access token for test_user."""
    with app.app_context():
        token = create_access_token(identity=test_user.username)
    return f"Bearer {token}"


@pytest.fixture(scope='function')
def client(app):
    """Flask test client."""
    return app.test_client()
