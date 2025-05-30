from models.like import Like
from repositories.like_repo import LikeRepo
from sqlalchemy.orm import Session


class LikeService:
    def __init__(self, db_session: Session):
        self.repo = LikeRepo(db_session)

    def create_like(self, user_id: int, video_id: int):
        existing_like = self.repo.get_by_user_and_video(user_id, video_id)
        if existing_like:
            existing_like.like = True
            self.repo.update(existing_like)
            return existing_like
        else:
            new_like = Like(user_id=user_id, video_id=video_id, like=True)
            return self.repo.create(new_like)

    def remove_like(self, user_id: int, video_id: int):
        existing_like = self.repo.get_by_user_and_video(user_id, video_id)
        if existing_like:
            existing_like.like = False
            return self.repo.update(existing_like)
        return None

    def get_like_count_by_video(self, video_id: int):
        return self.repo.get_like_count_by_video(video_id)

    def get_like_count_by_user(self, user_id: int):
        return self.repo.get_like_count_by_user(user_id)

    def get_likes_by_user(self, user_id: int):
        return self.repo.get_like_count_by_user(user_id)

    def get_likes_by_video(self, video_id: int):
        return self.repo.get_like_count_by_video(video_id)
