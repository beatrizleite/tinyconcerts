from models.like import Like
from sqlalchemy import func


class LikeRepo:
    def __init__(self, db_session):
        self.db = db_session

    def get_by_id(self, like_id, int):
        return self.db.query(Like).get(like_id)

    def get_by_user_and_video(self, user_id: int, video_id: int):
        return self.db.query(Like).filter(Like.user_id == user_id,
                                          Like.video_id == video_id
                                          ).first()

    def get_by_user(self, user_id: int):
        return self.db.query(Like).filter(Like.user_id == user_id).all()

    def get_by_video(self, video_id: int):
        return self.db.query(Like).filter(Like.video_id == video_id).all()

    def create(self, like: Like):
        self.db.add(like)
        self.db.commit()
        self.db.refresh(like)
        return like

    def update(self, like: Like):
        self.db.add(like)
        self.db.commit()
        return like

    def delete(self, like: Like):
        self.db.delete(like)
        self.db.commit()

    def get_like_count_by_video(self, video_id: int):
        return self.db.query(func.count(Like.id)).filter(
            Like.video_id == video_id, Like.like.is_(True)
        ).scalar()

    def get_like_count_by_user(self, user_id: int):
        return self.db.query(func.count(Like.id)).filter(
            Like.user_id == user_id, Like.like.is_(True)
        ).scalar()
