from models.video import Video
from models.like import Like
from sqlalchemy.sql import func
from sqlalchemy import distinct, or_, cast, Date
from typing import Dict, List, Optional, Tuple
from datetime import datetime


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

    def search_videos(self, keyword: str, page: int, per_page: int):
        """Legacy search method - kept for backward compatibility"""
        query = self.db.query(Video).filter(
            Video.title.ilike(f'%{keyword}%') | Video.description.ilike(f'%{keyword}%')
        )
        total = query.count()
        videos = query.offset((page - 1) * per_page).limit(per_page).all()
        return videos, total

    def search_videos_with_filters(self, keyword: Optional[str] = None,
                                   filters: Dict = None, page: int = 1,
                                   per_page: int = 10) -> Tuple[List[Video], int]:
        """Enhanced search with filters"""
        if filters is None:
            filters = {}

        query = self.db.query(Video)

        if keyword:
            keyword_filter = or_(
                Video.title.ilike(f'%{keyword}%'),
                Video.description.ilike(f'%{keyword}%')
            )
            query = query.filter(keyword_filter)

        query = self._apply_filters(query, filters)

        total = query.count()

        videos = query.offset((page - 1) * per_page).limit(per_page).all()

        return videos, total

    def get_all_videos_with_filters(self, filters: Dict = None,
                                    page: int = 1,
                                    per_page: int = 10) -> Tuple[List[Video], int]:
        """Get all videos with optional filters"""
        if filters is None:
            filters = {}

        query = self.db.query(Video)

        query = self._apply_filters(query, filters)

        total = query.count()

        videos = query.offset((page - 1) * per_page).limit(per_page).all()

        return videos, total

    def _apply_filters(self, query, filters: Dict):
        """Apply filters to a query"""
        if filters.get('category'):
            query = query.filter(
                Video.category.ilike(f'%{filters["category"]}%'))

        if filters.get('owner'):
            query = query.filter(
                Video.owner.ilike(f'%{filters["owner"]}%'))

        if filters.get('date_from'):
            try:
                date_from = datetime.strptime(
                    filters['date_from'], '%Y-%m-%d').date()
                query = query.filter(
                    cast(Video.published_at, Date) >= date_from
                    )
            except ValueError:
                pass

        if filters.get('date_to'):
            try:
                date_to = datetime.strptime(
                    filters['date_to'], '%Y-%m-%d').date()
                query = query.filter(
                    cast(Video.published_at, Date) <= date_to
                    )
            except ValueError:
                pass

        return query

    def get_all_categories(self) -> List[str]:
        """Get all unique categories"""
        categories = self.db.query(distinct(Video.category)).filter(
            Video.category.isnot(None),
            Video.category != ''
        ).all()
        return sorted([cat[0] for cat in categories if cat[0]])

    def get_all_owners(self) -> List[str]:
        """Get all unique owners"""
        owners = self.db.query(distinct(Video.owner)).filter(
            Video.owner.isnot(None),
            Video.owner != ''
        ).all()
        return sorted([owner[0] for owner in owners if owner[0]])

    def get_random_videos(self, limit=10):
        return self.db.query(Video).order_by(func.random()).limit(limit).all()

    def get_most_liked_videos(self, limit=10):
        return (
            self.db.query(
                Video,
                func.count(Like.id).label('likes_count')
            )
            .join(Like, (Like.video_id == Video.id) &
                  (Like.like is True), isouter=True)
            .group_by(Video.id)
            .order_by(func.count(Like.id).desc())
            .limit(limit)
            .all()
        )

    def get_most_recent_videos(self, limit=10):
        return self.db.query(Video).order_by(Video.published_at.desc()).limit(limit).all()

    def get_all_videos(self):
        """Legacy method - returns query object"""
        return self.db.query(Video)