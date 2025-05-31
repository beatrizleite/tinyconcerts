from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class Rating(Base):
    __tablename__ = 'ratings'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    rating = Column(Integer)

    user = relationship('User', back_populates='ratings')
    video = relationship('Video', back_populates='ratings')
