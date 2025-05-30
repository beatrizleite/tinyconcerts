from flask import Blueprint, request, jsonify
from flasgger import swag_from
from flask_jwt_extended import jwt_required, get_jwt_identity
from services import like_service
import os

like_bp = Blueprint('like_bp', __name__, url_prefix='/api/like')
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@like_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def update_like_status():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    video_id = data.get('video_id')
    if not video_id or not isinstance(video_id, int):
        return jsonify({"error": "Missing or invalid video_id"}), 400

    like_status = data.get('like')
    if like_status is None or not isinstance(like_status, bool):
        return jsonify({"error": "Missing or invalid 'like' field"}), 400

    user_id = get_jwt_identity()
    message, status = like_service.toggle_like(user_id, video_id, like_status)
    return jsonify({"message": message}), status


@like_bp.route('/user', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def get_likes_per_user():
    user_id = get_jwt_identity()
    likes = like_service.get_likes_for_user(user_id)
    return jsonify({
        "user_id": user_id,
        "likes": likes
    }), 200


@like_bp.route('/video', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_likes_per_video():
    video_id = request.args.get('video_id')
    if not video_id or not video_id.isdigit():
        return jsonify({"error": "Missing or invalid video_id"}), 400

    likes = like_service.get_likes_for_video(int(video_id))
    return jsonify({
        "video_id": video_id,
        "likes": likes
    }), 200
