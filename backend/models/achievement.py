from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from models.base import Base

class Achievement(Base):
    __tablename__ = 'achievements'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    required_count = Column(Integer)
    type = Column(String(100))  # e.g., VIEWS, COMMENTS, LIKES
