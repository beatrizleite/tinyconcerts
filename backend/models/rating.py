from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text, Float
from models.base import Base

class Rating(Base):
    __tablename__ = 'ratings'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    rating = Column(Integer)