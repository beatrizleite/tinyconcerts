from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from models.base import Base

class Report(Base):
    __tablename__ = 'reports'

    id = Column(Integer, primary_key=True)
    video_id = Column(Integer, ForeignKey('videos.id'), nullable=True)
    comment_id = Column(Integer, ForeignKey('comments.id'), nullable=True)
    report_reason = Column(String(100))
    status = Column(String(100))  # e.g., approved / rejected
