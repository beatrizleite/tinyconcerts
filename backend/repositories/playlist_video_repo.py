from models.playlist_video import PlaylistVideo


class PlaylistVideoRepo:
    def __init__(self, db_session):
        self.db = db_session

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
        return db.query(PlaylistVideo).filter_by(playlist_id=playlist_id,
                                                 video_id=video_id).first() is not None
