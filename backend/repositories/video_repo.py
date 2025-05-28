from models.video import Video
from models.like import Like
from sqlalchemy.sql import func


class VideoRepo:
    def __init__(self, db_session):
        self.db = db_session

    def get_by_id(self, video_id: int):
        return self.db.query(Video).get(video_id)

    def add(self, video: Video):
        self.db.add(video)
        self.db.commit()
        self.db.refresh(video)
        return video

    def update(self, video: Video):
        self.db.commit()
        self.db.refresh(video)
        return video

    def delete(self, video: Video):
        self.db.delete(video)
        self.db.commit()

    def search_by_title(self, keyword: str):
        return self.db.query(Video).filter(
            Video.title.ilike(f'%{keyword}%')
        ).all()

    def get_random_videos(self, limit=10):
        return self.db.query(Video).order_by(func.random()).limit(limit).all()

    def get_most_liked_videos(self, limit=10):
        return (
            self.db.query(
                Video,
                func.count(Like.id).label('likes_count')
            )
            .join(Like, (Like.video_id == Video.id) & (Like.like == True), isouter=True)
            .group_by(Video.id)
            .order_by(func.count(Like.id).desc())
            .limit(limit)
            .all()
        )

    def get_most_recent_videos(self, limit=10):
        return self.db.query(Video).order_by(Video.published_at.desc()).limit(limit).all()
