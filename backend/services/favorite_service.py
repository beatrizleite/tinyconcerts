from models.favorite import Favorite
from repositories.favorite_repo import FavoriteRepo
from sqlalchemy.orm import Session


class FavoriteService:
    def __init__(self, db_session: Session):
        self.repo = FavoriteRepo(db_session)

    def toggle_favorite(self,
                        user_id: int,
                        video_id: int,
                        favorite_status: bool):
        existing_favorite = self.repo.get_favorite_by_user_and_video(user_id,
                                                                     video_id)
        if existing_favorite:
            existing_favorite.favorite = favorite_status
            self.repo.update_favorite(existing_favorite)
        else:
            new_favorite = Favorite(user_id=user_id,
                                    video_id=video_id,
                                    favorite=favorite_status)
            self.repo.create_favorite(new_favorite)

    def get_favorite_count_by_video(self, video_id: int):
        return self.repo.get_favorite_count_by_video(video_id)

    def get_favorite_count_by_user(self, user_id: int):
        return self.repo.get_favorite_count_by_user(user_id)

    def get_favorites_by_user(self, user_id: int):
        favorites = self.repo.get_by_user(user_id)
        return [{
        "id": favorite.id,
        "video_id": favorite.video.id,
        "title": favorite.video.title,
        "image_320_180": favorite.video.image_320_180,
        "uploaded": favorite.video.published_at.split("T")[0]  # remove a hora, fica só a data
    } for favorite in favorites]


    def get_favorites_by_video(self, video_id: int):
        return self.repo.get_by_video(video_id)

    def is_favorited_by_user(self, user_id: int, video_id: int):
        return self.repo.is_favorited_by_user(user_id, video_id)
