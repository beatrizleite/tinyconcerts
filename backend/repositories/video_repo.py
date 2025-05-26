from models.video import Video


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
