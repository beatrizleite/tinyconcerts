from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from database import Base

class PlaylistVideo(Base):
    __tablename__ = 'playlist_video'

    id = Column(Integer, primary_key=True)
    playlist_id = Column(Integer, ForeignKey('playlists.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
