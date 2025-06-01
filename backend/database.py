import os
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
from models.base import Base

engine = None
db_session = scoped_session(sessionmaker())


def init_db(db_url=None):
    db_url = db_url or os.getenv('DATABASE_URL')

    if not db_url:
        raise ValueError("DATABASE_URL is not set!")

    global engine

    from models import (
        user,
        video,
        achievement,
        comment,
        like,
        favorite,
        playlist,
        playlist_video,
        rating,
        report
    )  # noqa: F401

    if db_url.startswith('sqlite'):
        engine = create_engine(
            db_url,
            connect_args={"check_same_thread": False}
        )
    else:
        engine = create_engine(db_url,
                               pool_size=50,
                               max_overflow=50,
                               pool_timeout=30
                               )

    db_session.configure(bind=engine)
    Base.query = db_session.query_property()
    Base.metadata.create_all(bind=engine)


def drop_db():
    global engine
    Base.metadata.drop_all(bind=engine)
