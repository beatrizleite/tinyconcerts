from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from database import Base

class Video(Base):
    __tablename__ = 'videos'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    video_link = Column(String, nullable=False)
    category = Column(String)
    published_at = Column(String)
    owner = Column(String)
    owner_url = Column(String)
    image_320_180 = Column(String)
