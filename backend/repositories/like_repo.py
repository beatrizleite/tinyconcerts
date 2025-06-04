from models.like import Like
from sqlalchemy import func


class LikeRepo:
    def __init__(self, db_session):
        self.db = db_session

    def get_by_id(self, like_id, int):
        return self.db.query(Like).get(like_id)

    def get_like_by_user_and_video(self, user_id: int, video_id: int):
        return self.db.query(Like).filter_by(
            user_id=user_id,
            video_id=video_id).first()

    def get_by_user(self, user_id: int):
         return (
        self.db.query(Like)
        .join(Like.video)  # Faz join com a tabela Video
        .filter(Like.user_id == user_id, Like.like.is_(True))
        .all()
    )



    def get_by_video(self, video_id: int):
        return self.db.query(Like).filter(Like.video_id == video_id).all()

    def create_like(self, like: Like):
        self.db.add(like)
        self.db.commit()

    def update_like(self, like: Like):
        self.db.commit()

    def get_like_count_by_video(self, video_id: int):
        return self.db.query(func.count(Like.id)).filter(
            Like.video_id == video_id, Like.like.is_(True)
        ).scalar()

    def get_like_count_by_user(self, user_id: int):
        return self.db.query(func.count(Like.id)).filter(
            Like.user_id == user_id, Like.like.is_(True)
        ).scalar()

    def is_liked_by_user(self, user_id: int, video_id: int) -> bool:
        like = self.db.query(Like).filter_by(user_id=user_id,
                                             video_id=video_id,
                                             like=True).first()
        return like is not None
