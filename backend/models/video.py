from sqlalchemy import Column, Integer, String, Text
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

    comments = relationship('Comment', back_populates='video',
                            cascade='all, delete-orphan')
    likes = relationship('Like', back_populates='video',
                         cascade='all, delete-orphan')
    playlist_videos = relationship('PlaylistVideo', back_populates='video',
                                   cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "video_link": self.video_link,
            "category": self.category,
            "published_at": self.published_at,
            "owner": self.owner,
            "owner_url": self.owner_url,
            "image_320_180": self.image_320_180,
        }
