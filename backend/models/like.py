from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class Like(Base):
    __tablename__ = 'likes'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    like = Column(Boolean, nullable=False)

    user = relationship('User', back_populates='likes')
    video = relationship('Video', back_populates='likes')
