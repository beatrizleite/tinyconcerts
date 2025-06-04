from flask import Blueprint, request, jsonify
from flasgger import swag_from
from database import db_session
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from services.user_service import UserService
from utils.token_blacklist import add_token_to_blacklist
import os

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')
user_service = UserService(db_session)
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@auth_bp.route('/register', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "Missing JSON body"}), 400

    try:
        user = user_service.createUser(data)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "id": user.id,
        "username": user.username,
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 201


@auth_bp.route('/logout', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def logout():
    """Logout"""
    jwt_data = get_jwt()
    jti = jwt_data["jti"]
    user_id = get_jwt_identity()
    print(f"Logging out user {user_id} with jti {jti}")
    add_token_to_blacklist(jti)
    return jsonify({"message": "Successfully logged out"}), 200


@auth_bp.route('/login', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username and password!"}), 400

    user = user_service.verifyUser(username, password)
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ Gera token com o role incluído como claim
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )
    refresh_token = create_refresh_token(identity=str(user.id))

    return jsonify({
        "id": user.id,
        "username": user.username,
        "access_token": access_token,
        "refresh_token": refresh_token
    }), 200

