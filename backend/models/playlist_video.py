from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class PlaylistVideo(Base):
    __tablename__ = 'playlist_video'

    id = Column(Integer, primary_key=True)
    playlist_id = Column(Integer, ForeignKey('playlists.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))

    playlist = relationship('Playlist', back_populates='playlist_videos')
    video = relationship('Video', back_populates='playlist_videos')
