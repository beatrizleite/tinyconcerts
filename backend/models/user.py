from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from models.base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    fname = Column(String(100), nullable=False)
    lname = Column(String(100), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    birthday = Column(Date)
    password_hash = Column(String(255), nullable=False)
