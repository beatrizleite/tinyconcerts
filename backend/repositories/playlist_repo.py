from models.playlist import Playlist


class PlaylistRepo:
    def __init__(self, db):
        self.db = db

    def create(self, playlist: Playlist):
        self.db.add(playlist)
        self.db.commit()
        self.db.refresh(playlist)
        return playlist

    def get_by_id(self, playlist_id: int):
        return self.db.query(Playlist).filter(Playlist.id == playlist_id).first()

    def update(self, playlist: Playlist):
        self.db.add(playlist)
        self.db.commit()
        self.db.refresh(playlist)
        return playlist

    def delete(self, playlist: Playlist):
        self.db.delete(playlist)
        self.db.commit()

    def get_by_user_id(self, user_id: int):
        return self.db.query(Playlist).filter(Playlist.user_id == user_id).all()
