class PlaylistVideoService:
    def __init__(self, playlist_repo, video_repo, playlist_video_repo):
        self.playlist_repo = playlist_repo
        self.video_repo = video_repo
        self.playlist_video_repo = playlist_video_repo

    def get_playlist_videos_paginated(self, db, playlist_id, page, per_page):
        if not self.playlist_repo.get_by_id(playlist_id):
            raise ValueError("Playlist not found")

        videos_data = self.playlist_video_repo.get_videos_by_playlist_paginated(
            db, playlist_id, page, per_page
        )
        return videos_data

    def add_video_to_playlist(self, db, playlist_id, video_id):
        if not self.playlist_repo.get_by_id(playlist_id):
            raise ValueError("Playlist not found")
        if not self.video_repo.get_by_id(video_id):
            raise ValueError("Video not found")

        if self.playlist_video_repo.exists(db, playlist_id, video_id):
            raise ValueError("Video already in playlist")

        return self.playlist_video_repo.add(db, playlist_id, video_id)

    def remove_video_from_playlist(self, db, playlist_id, video_id):
        if not self.playlist_repo.get_by_id(playlist_id):
            raise ValueError("Playlist not found")
        if not self.video_repo.get_by_id(video_id):
            raise ValueError("Video not found")

        removed = self.playlist_video_repo.remove(db, playlist_id, video_id)
        if not removed:
            raise ValueError("Video not in playlist")
        return True
