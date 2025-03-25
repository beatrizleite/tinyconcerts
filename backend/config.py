import os
from dotenv import load_dotenv

load_dotenv()

FLASK_RUN_HOST = os.getenv("FLASK_RUN_HOST")
FLASK_RUN_PORT = os.getenv("FLASK_RUN_PORT")
