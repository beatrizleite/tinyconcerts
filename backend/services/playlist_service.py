from repositories.playlist_repo import PlaylistRepo
from models.playlist import Playlist


class PlaylistService:
    def __init__(self, db):
        self.repo = PlaylistRepo(db)

    def create_playlist(self, data):
        playlist = Playlist(**data)
        return self.repo.create(playlist)

    def get_playlist(self, playlist_id: int):
        return self.repo.get_by_id(playlist_id)

    def update_playlist(self, playlist_id: int, data):
        playlist = self.repo.get_by_id(playlist_id)
        if not playlist:
            return None
        for key, value in data.items():
            setattr(playlist, key, value)
        return self.repo.update(playlist)

    def delete_playlist(self, playlist_id: int):
        playlist = self.repo.get_by_id(playlist_id)
        if not playlist:
            return False
        self.repo.delete(playlist)
        return True

    def get_playlists_by_user(self, user_id: int):
        return self.repo.get_by_user_id(user_id)
