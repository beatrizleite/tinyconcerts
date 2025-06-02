from models.rating import Rating
from sqlalchemy import func


class RatingRepo:
    def __init__(self, db_session):
        self.db = db_session

    def get_rating_by_user_and_video(self, user_id: int, video_id: int):
        return (
            self.db.query(Rating)
            .filter_by(user_id=user_id, video_id=video_id)
            .first()
        )

    def create_rating(self, user_id: int, video_id: int, rating: int):
        new_rating = Rating(user_id=user_id, video_id=video_id, rating=rating)
        self.db.add(new_rating)
        self.db.commit()
        self.db.refresh(new_rating)
        return new_rating

    def update_rating(self, user_id: int, video_id: int, rating: int):
        existing_rating = (
            self.db.query(Rating)
            .filter_by(user_id=user_id, video_id=video_id)
            .first()
        )
        if existing_rating:
            existing_rating.rating = rating
            self.db.commit()
            self.db.refresh(existing_rating)
        return existing_rating

    def get_average_rating(self, video_id: int):
        avg_rating = self.db.query(func.avg(Rating.rating)).filter_by(
            video_id=video_id
            ).scalar()
        if avg_rating:
            return round(avg_rating, 2)
        return None
