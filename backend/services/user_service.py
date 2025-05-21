from models.user import User
from repositories.user_repo import UserRepo
from sqlalchemy.orm import Session
from werkzeug.security import generate_password_hash
from datetime import datetime

class UserService:
    def __init__(self, db_session: Session):
        self.repo = UserRepo(db_session)

    def createUser(self, data):
        raw_password = data.pop('password', None)
        if raw_password is None:
            raise ValueError("Password is required")
        data['password_hash'] = generate_password_hash(raw_password)
        if isinstance(data.get("birthday"), str):
            data["birthday"] = datetime.strptime(data["birthday"], "%Y-%m-%d").date()
        user = User(**data)
        return self.repo.create(user)
    
    def getUser(self, user_id):
        return self.repo.getById(user_id)
    
    def getAllUsers(self):
        return self.repo.getAll()
    
    def getByUsername(self, username):
        return self.repo.getByUsername(username)
    
    def updateUser(self, user_id, data):
        user = self.repo.getById(user_id)
        if not user:
            return None
        for key, value in data.items():
            setattr(user, key, value)
        return self.repo.update(user)
    
    def deleteUser(self, user_id):
        user = self.repo.getById(user_id)
        if not user:
            return False
        self.repo.delete(user)
        return True