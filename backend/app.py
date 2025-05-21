from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
import config
from routes import register_routes
from database import init_db


def create_app(test_config=None):
    app = Flask(__name__)
    Swagger(app, template_file='swagger/api_docs.yaml')
    CORS(app)
    register_routes(app)

    if test_config is None:
        init_db()
    else:
        app.config.update(test_config)
        init_db(app.config.get('DATABASE_URL'))

    
    @app.route('/')
    def home():
        return "This is the API. swagger at /apidocs"

    return app


app = create_app()


if __name__ == '__main__':
    app.run(
        debug=True,
        host=config.FLASK_RUN_HOST,
        port=int(config.FLASK_RUN_PORT)
    )
