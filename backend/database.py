from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
import config
from models.base import Base

if not config.DATABASE_URL:
    raise ValueError("DATABASE_URL is not set.")

engine = create_engine(config.DATABASE_URL)
db_session = scoped_session(sessionmaker(bind=engine))

Base.query = db_session.query_property()

def init_db():
    from models import user, video, achievement, comment, like, playlist, playlist_video, rating, report
    Base.metadata.create_all(bind=engine)
