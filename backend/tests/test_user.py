import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_users(client):
    response = client.get('/api/user')
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_create_user(client):
    payload = {
        "name": "Test User",
        "email": "test@example.com"
    }
    response = client.post('/api/user', json=payload)
    assert response.status_code in (200, 201)
    assert "id" in response.json or "message" in response.json
