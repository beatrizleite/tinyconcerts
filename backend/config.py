import os
from dotenv import load_dotenv

load_dotenv()

FLASK_RUN_HOST = os.getenv("FLASK_RUN_HOST")
FLASK_RUN_PORT = os.getenv("FLASK_RUN_PORT")
DATABASE_URL = f"mssql://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

