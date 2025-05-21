import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app

@pytest.fixture
def client():
    test_config = {
        'TESTING': True,
        'DATABASE_URL': "sqlite:///:memory:"
    }

    app = create_app(test_config)

    with app.test_client() as client:
        yield client

def test_create_user(client):
    payload = {
        "birthday": "Mon, 01 Jan 1990 00:00:00 GMT",
        "email": "test@example.com",
        "fname": "Test",
        "lname": "User",
        "password": "secret123",
        "username": "testuser"
    }
    response = client.post('/api/user', json=payload)
    assert response.status_code in (200, 201)
    assert "id" in response.json or "message" in response.json


def test_get_users(client):
    response = client.get('/api/user')
    assert response.status_code == 200
    assert isinstance(response.json, list)

