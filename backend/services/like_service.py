from models.like import Like
from repositories.like_repo import LikeRepo
from sqlalchemy.orm import Session


class LikeService:
    def __init__(self, db_session: Session):
        self.repo = LikeRepo(db_session)

    def toggle_like(self, user_id: int, video_id: int, like_status: bool):
        existing_like = self.repo.get_like_by_user_and_video(user_id, video_id)
        if existing_like:
            existing_like.like = like_status
            self.repo.update_like(existing_like)
        else:
            new_like = Like(user_id=user_id,
                            video_id=video_id,
                            like=like_status)
            self.repo.create_like(new_like)

    def get_like_count_by_video(self, video_id: int):
        return self.repo.get_like_count_by_video(video_id)

    def get_like_count_by_user(self, user_id: int):
        return self.repo.get_like_count_by_user(user_id)

    def get_likes_by_user(self, user_id: int):
        likes = self.repo.get_by_user(user_id)
        return [{
        "id": like.id,
        "video_id": like.video.id,
        "title": like.video.title,
        "image_320_180": like.video.image_320_180,
        "uploaded": like.video.published_at.split("T")[0]  # remove a hora, fica só a data
    } for like in likes]


    def get_likes_by_video(self, video_id: int):
        return self.repo.get_like_count_by_video(video_id)

    def is_liked_by_user(self, user_id: int, video_id: int):
        return self.repo.is_liked_by_user(user_id, video_id)
