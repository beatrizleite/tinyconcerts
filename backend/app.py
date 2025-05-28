import os
import logging
from flask import Flask, jsonify
from flasgger import Swagger
from flask_cors import CORS
import config
from routes import register_routes
from database import init_db
from flask_jwt_extended import JWTManager
from utils.token_blacklist import is_token_revoked


def create_app(test_config=None):
    app = Flask(__name__)

    basedir = os.path.abspath(os.path.dirname(__file__))
    swagger_path = os.path.join(basedir, 'swagger', 'api_docs.yaml')
    Swagger(app, template_file=swagger_path)

    # add this to origins to test locally: ["http://localhost:5173", "http://127.0.0.1:5173"]
    CORS(app, resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True)

    if test_config is None:
        app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_ENV", "secretkey")
        app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 900
        app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 86400
        app.config["JWT_TOKEN_LOCATION"] = ["headers"]

        jwt = JWTManager(app)

        @jwt.token_in_blocklist_loader
        def check_if_token_revoked(jwt_header, jwt_payload):
            return is_token_revoked(jwt_payload)

        @jwt.revoked_token_loader
        def revoked_token_response(jwt_header, jwt_payload):
            logging.error("Token was revoked!")
            return jsonify({"msg": "Token has been revoked"}), 401

        @jwt.invalid_token_loader
        def invalid_token_response(err_msg):
            logging.error(f"Invalid token error: {err_msg}")
            return jsonify({"msg": "Token is invalid"}), 401

        @jwt.expired_token_loader
        def expired_token_response(jwt_header, jwt_payload):
            logging.error("Expired token!")
            return jsonify({"msg": "Token has expired"}), 401

        @jwt.unauthorized_loader
        def missing_token_response(err_msg):
            logging.error(f"Missing token error: {err_msg}")
            return jsonify({"msg": "Missing token"}), 401

        database_url = os.getenv('DATABASE_URL') or getattr(config,
                                                            'DATABASE_URL',
                                                            None
                                                            )
        if not database_url:
            raise ValueError("DATABASE_URL is not set!")
        init_db(database_url)
    else:
        app.config.update(test_config)
        init_db(app.config.get('DATABASE_URL'))

    register_routes(app)

    @app.route('/')
    def home():
        return "This is the API. swagger at /apidocs"

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(
        debug=True,
        host=config.FLASK_RUN_HOST,
        port=int(config.FLASK_RUN_PORT),
        # comment ssl_context to make sure it works locally
        ssl_context=('cert.pem', 'key.pem')
    )
