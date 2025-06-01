from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class Favorite(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    favorite = Column(Boolean, nullable=False)

    user = relationship('User', back_populates='favorites')
    video = relationship('Video', back_populates='favorites')
