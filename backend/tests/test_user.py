import pytest
from services.user_service import UserService
from repositories.user_repo import UserRepo

@pytest.fixture
def user_service(test_db_session):
    repo = UserRepo(test_db_session)
    service = UserService(repo)
    return service

def test_create_user(client, user_service):
    payload = {
        "birthday": "1990-01-01",
        "email": "test@example.com",
        "fname": "Test",
        "lname": "User",
        "password": "secret123",
        "username": "testuser"
    }
    response = client.post('/api/user', json=payload)
    assert response.status_code in (200, 201)
    assert "id" in response.json

def test_get_users(client):
    response = client.get('/api/user')
    assert response.status_code == 200
    assert isinstance(response.json, list)
