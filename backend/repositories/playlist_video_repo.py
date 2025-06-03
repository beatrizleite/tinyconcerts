from models.playlist_video import PlaylistVideo
from sqlalchemy import func
from models.video import Video
from models.playlist import Playlist


class PlaylistVideoRepo:
    def __init__(self, db_session):
        self.db = db_session

    def get_videos_by_playlist_paginated(self, db,
                                         playlist_id,
                                         page,
                                         per_page):
        """Get videos in a playlist with pagination"""
        offset = (page - 1) * per_page

        playlist = db.query(Playlist).filter(
            Playlist.id == playlist_id).first()

        total_count = db.query(func.count(PlaylistVideo.id)).filter(
            PlaylistVideo.playlist_id == playlist_id
        ).scalar()

        query = db.query(PlaylistVideo).filter(
            PlaylistVideo.playlist_id == playlist_id
        ).offset(offset).limit(per_page)

        playlist_videos = query.all()

        videos = []
        for pv in playlist_videos:
            video = db.query(Video).filter(Video.id == pv.video_id).first()
            if video:
                video_data = video.to_dict()
                video_data["playlist_video_id"] = pv.id
                videos.append(video_data)

        total_pages = (total_count + per_page - 1) // per_page
        has_next = page < total_pages
        has_prev = page > 1

        return {
            "name": playlist.name,
            "videos": videos,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total_count,
                "total_pages": total_pages,
                "has_next": has_next,
                "has_prev": has_prev
            }
        }

    def add(self, db, playlist_id, video_id):
        entry = PlaylistVideo(playlist_id=playlist_id, video_id=video_id)
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return entry

    def remove(self, db, playlist_id, video_id):
        entry = db.query(PlaylistVideo).filter_by(playlist_id=playlist_id,
                                                  video_id=video_id).first()
        if entry:
            db.delete(entry)
            db.commit()
            return True
        return False

    def exists(self, db, playlist_id, video_id):
        return db.query(
            PlaylistVideo).filter_by(playlist_id=playlist_id,
                                     video_id=video_id).first() is not None
