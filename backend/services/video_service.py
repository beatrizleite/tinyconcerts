import logging
from typing import List
from models.video import Video
from repositories.video_repo import VideoRepo
from services.like_service import LikeService
import pandas as pd

logger = logging.getLogger(__name__)


class NotFoundError(Exception):
    pass


class VideoService:
    def __init__(self, db_session, like_service=None):
        self.repo = VideoRepo(db_session)
        self.like_service = like_service or LikeService(db_session)

    def create_video(self, data: dict) -> Video:
        required_fields = ['title', 'video_link', 'image_320_180']
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"{field} is required.")

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

    def get_video_by_id(self, video_id: int) -> dict:
        video = self.repo.get_by_id(video_id)
        if not video:
            raise NotFoundError(f"Video with id {video_id} not found.")

        video_data = video.to_dict()

        like_count = self.like_service.get_likes_by_video(video_id)
        video_data['like_count'] = like_count

        return video_data

    def update_video(self, video_id: int, data: dict) -> Video:
        video = self.repo.get_by_id(video_id)
        if not video:
            raise NotFoundError(f"Video with id {video_id} not found.")
        self._update_fields(video, data, [
            'title', 'description', 'video_link', 'category',
            'published_at', 'owner', 'owner_url', 'image_320_180'
        ])
        return self.repo.update(video)

    def delete_video(self, video_id: int) -> None:
        video = self.repo.get_by_id(video_id)
        if not video:
            raise NotFoundError(f"Video with id {video_id} not found.")
        self.repo.delete(video)

    def search_videos(self, keyword, page, per_page):
        query = self.db_session.query(Video).filter(
            Video.title.ilike(f'%{keyword}%') | Video.description.ilike(
                f'%{keyword}%')
        )
        total = query.count()
        videos = query.offset((page - 1) * per_page).limit(per_page).all()
        return videos, total

    def report_video(self, video_id: int, report_data: dict) -> bool:
        logger.info(f"Video {video_id} reported with data: {report_data}")
        return True

    def import_videos_from_file(self, file) -> List[int]:
        """
        Processes an Excel or CSV file and creates videos
        for rows that have at least title, video_link, and thumbnail.
        """
        ext = file.filename.rsplit('.', 1)[-1].lower()
        if ext not in ['xls', 'xlsx', 'csv']:
            raise ValueError("Invalid file type. Only xls, xlsx, and csv are supported.")

        try:
            if ext == 'csv':
                df = pd.read_csv(file)
            else:
                df = pd.read_excel(file)
        except Exception as e:
            raise ValueError(f"Error reading file: {e}")

        created_video_ids = []
        for _, row in df.iterrows():
            title = row.get('title')
            video_link = row.get('video_link')
            thumbnail = row.get('image_320_180')

            if pd.notna(title) and pd.notna(video_link) and pd.notna(thumbnail):
                video_data = {
                    'title': str(title),
                    'video_link': str(video_link),
                    'image_320_180': str(thumbnail),
                    'description': str(row.get('description')) if pd.notna(
                        row.get('description')) else None,
                    'category': str(row.get('category')) if pd.notna(
                        row.get('category')) else None,
                    'published_at': row.get('published_at'),
                    'owner': str(row.get('owner')) if pd.notna(
                        row.get('owner')) else None,
                    'owner_url': str(row.get('owner_url')) if pd.notna(
                        row.get('owner_url')) else None
                }
                video = self.create_video(video_data)
                created_video_ids.append(video.id)

        return created_video_ids

    def get_random_videos(self, limit: int = 10) -> List[Video]:
        return self.repo.get_random_videos(limit=limit)

    def get_most_liked_videos(self, limit: int = 10) -> List[Video]:
        return self.repo.get_most_liked_videos(limit=limit)

    def get_most_recent_videos(self, limit=10):
        buffer_limit = limit * 5

        videos = self.repo.get_most_recent_videos(limit=buffer_limit)

        seen_titles = set()
        unique_videos = []

        for video in videos:
            if video.title not in seen_titles:
                unique_videos.append(video)
                seen_titles.add(video.title)
            if len(unique_videos) == limit:
                break

        return unique_videos

    def _update_fields(self, obj, data: dict, fields: List[str]) -> None:
        for field in fields:
            if field in data:
                setattr(obj, field, data[field])

    def get_all_videos(self, page, per_page):
        query = self.db_session.query(Video)
        total = query.count()
        videos = query.offset((page - 1) * per_page).limit(per_page).all()
        return videos, total
