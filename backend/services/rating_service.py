from repositories.rating_repo import RatingRepo
from sqlalchemy.orm import Session


class RatingService:
    def __init__(self, db_session: Session):
        self.repo = RatingRepo(db_session)

    def create_rating(self, user_id: int, video_id: int, rating: int):
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5.")
        existing_rating = self.repo.get_rating_by_user_and_video(user_id,
                                                                 video_id)

        if existing_rating:
            self.repo.update_rating(user_id, video_id, rating)
        else:
            self.repo.create_rating(user_id, video_id, rating)

    def get_average_rating(self, video_id: int):
        return self.repo.get_average_rating(video_id)
