from models.user import User


class UserRepo:
    def __init__(self, db_session):
        self.db = db_session

    def get_by_id(self, user_id: int):
        return self.db.query(User).get(user_id)

    def get_all(self):
        return self.db.query(User).all()

    def get_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    def create(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User):
        self.db.commit()
        return user

    def delete(self, user: User):
        self.db.delete(user)
        self.db.commit()
