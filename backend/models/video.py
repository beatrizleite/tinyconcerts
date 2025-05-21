from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from models.base import Base

class Video(Base):
    __tablename__ = 'videos'

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    video_link = Column(Text, nullable=False)
    category = Column(String(100))
    published_at = Column(String(100))
    owner = Column(String(100))
    owner_url = Column(String(100))
    image_320_180 = Column(String(100))
