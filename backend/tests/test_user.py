import pytest
from services.user_service import UserService
from repositories.user_repo import UserRepo


@pytest.fixture
def user_service(test_db_session):
    repo = UserRepo(test_db_session)
    service = UserService(repo)
    return service


def test_get_users(client, access_token):
    response = client.get('/api/user/all', headers={
        "Authorization": access_token
    })
    assert response.status_code == 200
    assert isinstance(response.json, list)
