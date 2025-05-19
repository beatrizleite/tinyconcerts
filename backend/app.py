from flask import Flask, jsonify
from flasgger import Swagger
from flask_cors import CORS
import config 
from routes import register_routes
from database import init_db

app = Flask(__name__)

swagger = Swagger(app, template_file='swagger/api_docs.yaml')

CORS(app)

register_routes(app)

@app.route('/')
def home():
    return "This is the API. swagger at /apidocs"


if __name__ == '__main__':
    init_db()
    app.run(
        debug=True, 
        host=config.FLASK_RUN_HOST, 
        port=int(config.FLASK_RUN_PORT))
