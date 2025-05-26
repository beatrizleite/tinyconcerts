from models.video import Video
from repositories.video_repo import VideoRepo


class VideoService:
    def __init__(self, db_session):
        self.repo = VideoRepo(db_session)

    def create_video(self, data: dict) -> Video:
        video = Video(
            title=data.get('title'),
            description=data.get('description'),
            video_link=data.get('video_link'),
            category=data.get('category'),
            published_at=data.get('published_at'),
            owner=data.get('owner'),
            owner_url=data.get('owner_url'),
            image_320_180=data.get('image_320_180')
        )
        return self.repo.add(video)

    def get_video_by_id(self, video_id: int) -> Video:
        return self.repo.get_by_id(video_id)

    def update_video(self, video_id: int, data: dict) -> Video:
        video = self.repo.get_by_id(video_id)
        if not video:
            return None
        for key in ['title', 'description', 'video_link', 'category',
                    'published_at', 'owner', 'owner_url', 'image_320_180']:
            if key in data:
                setattr(video, key, data[key])
        return self.repo.update(video)

    def delete_video(self, video_id: int) -> bool:
        video = self.repo.get_by_id(video_id)
        if not video:
            return False
        self.repo.delete(video)
        return True

    def search_video(self, keyword: str):
        return self.repo.search_by_title(keyword)

    def report_video(self, video_id: int, report_data: dict) -> bool:
        print(f"Video {video_id} reported with data: {report_data}")
        return True
