from sqlalchemy import Column, Integer, String, Date, Text
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
    password_hash = Column(Text, nullable=False)
    role = Column(Integer, nullable=False, default=0)

    comments = relationship('Comment', back_populates='user',
                            cascade='all, delete-orphan')
    likes = relationship('Like', back_populates='user',
                         cascade='all, delete-orphan')
    playlists = relationship('Playlist', back_populates='user',
                             cascade='all, delete-orphan')
    ratings = relationship('Rating', back_populates='user',
                           cascade='all, delete-orphan')
    favorites = relationship('Favorite', back_populates='user',
                             cascade='all, delete-orphan')
