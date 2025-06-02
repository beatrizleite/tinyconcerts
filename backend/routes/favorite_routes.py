from flask import Blueprint, request, jsonify
from flasgger import swag_from
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.favorite_service import FavoriteService
from database import db_session
import os

favorite_bp = Blueprint('favorite_bp', __name__, url_prefix='/api/favorite')
favorite_service = FavoriteService(db_session)
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@favorite_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def update_favorite_status():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    video_id = data.get('video_id')
    favorite_status = data.get('favorite_status')
    if not isinstance(video_id, int):
        return jsonify({"error": "Invalid or missing 'video_id'"}), 400
    if not isinstance(favorite_status, bool):
        return jsonify({"error": "Invalid or missing 'favorite_status'"}), 400

    user_id = get_jwt_identity()
    favorite_service.toggle_favorite(user_id, video_id, favorite_status)
    return jsonify({"message": "Success"}), 200


@favorite_bp.route('/user', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def get_favorites_per_user():
    user_id = get_jwt_identity()
    favorites = favorite_service.get_favorites_by_user(user_id)
    return jsonify({
        "user_id": user_id,
        "favorites": favorites
    }), 200


@favorite_bp.route('/video', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_favorites_per_video():
    video_id = request.args.get('video_id')
    if not video_id or not video_id.isdigit():
        return jsonify({"error": "Missing or invalid video_id"}), 400

    favorites = favorite_service.get_favorites_by_video(int(video_id))
    return jsonify({
        "video_id": video_id,
        "favorites": favorites
    }), 200
