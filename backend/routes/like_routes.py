from flask import Blueprint, request, jsonify
from flasgger import swag_from
import os

like_bp = Blueprint('like_bp', __name__, url_prefix='/api/like')
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@like_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def update_like_status():
    """Update Like Status"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@like_bp.route('/user', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_likes_per_user():
    """Get Likes Per User"""
    return jsonify({"message": "Not implemented yet"}), 501


@like_bp.route('/video', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_likes_per_video():
    """Get Likes Per Video"""
    return jsonify({"message": "Not implemented yet"}), 501
