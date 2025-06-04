from sqlalchemy import Column, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from models.base import Base


class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    video_id = Column(Integer, ForeignKey('videos.id'))
    comment_text = Column(Text, nullable=False)

    user = relationship('User', back_populates='comments')
    video = relationship('Video', back_populates='comments')
    reports = relationship("Report", back_populates="comment",
                           cascade="all, delete-orphan")
