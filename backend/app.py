from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
import config
from routes import register_routes
from database import init_db

def create_app():
    app = Flask(__name__)
    
    Swagger(app, template_file='swagger/api_docs.yaml')
    CORS(app)
    register_routes(app)

    with app.app_context():
        init_db()

    @app.route('/')
    def home():
        return "This is the API. swagger at /apidocs"

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        debug=True,
        host=config.FLASK_RUN_HOST,
        port=int(config.FLASK_RUN_PORT)
    )
