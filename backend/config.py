import os
from dotenv import load_dotenv

load_dotenv()

FLASK_RUN_HOST = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
FLASK_RUN_PORT = os.getenv("FLASK_RUN_PORT", 5000)
DATABASE_URL = os.getenv("DATABASE_URL")

