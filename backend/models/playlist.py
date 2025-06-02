from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class Playlist(Base):
    __tablename__ = 'playlists'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String(100), nullable=False)

    playlist_videos = relationship('PlaylistVideo', back_populates='playlist',
                                   cascade='all, delete-orphan')
    user = relationship('User', back_populates='playlists')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "videos": [pv.video_id for pv in self.playlist_videos]
        }
