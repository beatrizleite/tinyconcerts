from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
from models.base import Base

engine = None
db_session = scoped_session(sessionmaker())

def init_db(db_url=None):
    global engine, db_session

    from models import user, video, achievement, comment, like, playlist, playlist_video, rating, report

    if not db_url:
        from config import DATABASE_URL
        if not DATABASE_URL:
            raise ValueError("DATABASE_URL is not set!")
        db_url = DATABASE_URL

    engine = create_engine(db_url)
    db_session = scoped_session(sessionmaker(bind=engine))
    Base.query = db_session.query_property()

    Base.metadata.create_all(bind=engine)

def drop_db():
    global engine
    Base.metadata.drop_all(bind=engine)
