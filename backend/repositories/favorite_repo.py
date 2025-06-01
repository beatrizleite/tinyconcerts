from models.favorite import Favorite
from sqlalchemy import func


class FavoriteRepo:
    def __init__(self, db_session):
        self.db = db_session

    def get_by_id(self, favorite_id: int):
        return self.db.query(Favorite).get(favorite_id)

    def get_favorite_by_user_and_video(self, user_id: int, video_id: int):
        return self.db.query(Favorite).filter_by(
            user_id=user_id,
            video_id=video_id
        ).first()

    def get_by_user(self, user_id: int):
        return self.db.query(Favorite).filter(
            Favorite.user_id == user_id).all()

    def get_by_video(self, video_id: int):
        return self.db.query(Favorite).filter(
            Favorite.video_id == video_id).all()

    def create_favorite(self, favorite: Favorite):
        self.db.add(favorite)
        self.db.commit()

    def update_favorite(self, favorite: Favorite):
        self.db.commit()

    def get_favorite_count_by_video(self, video_id: int):
        return self.db.query(func.count(Favorite.id)).filter(
            Favorite.video_id == video_id, Favorite.favorite.is_(True)
        ).scalar()

    def get_favorite_count_by_user(self, user_id: int):
        return self.db.query(func.count(Favorite.id)).filter(
            Favorite.user_id == user_id, Favorite.favorite.is_(True)
        ).scalar()

    def is_favorited_by_user(self, user_id: int, video_id: int) -> bool:
        favorite = self.db.query(Favorite).filter_by(user_id=user_id,
                                                     video_id=video_id,
                                                     favorite=True).first()
        return favorite is not None
