from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
import config
from models.base import Base

DATABASE_URL = config.DATABASE_URL

engine = create_engine(DATABASE_URL)
db_session = scoped_session(sessionmaker(bind=engine))

Base.query = db_session.query_property()

def init_db():
    from models import user, video, achievement, comment, like, playlist, playlist_video, rating, report
    Base.metadata.create_all(bind=engine)
