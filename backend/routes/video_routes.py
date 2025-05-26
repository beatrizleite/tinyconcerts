from flask import Blueprint, request, jsonify
from flasgger import swag_from
import os

video_bp = Blueprint('video_bp', __name__, url_prefix='/api/video')
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@video_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def create_video():
    """Create Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_video_by_id():
    """Get Video By Id"""
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('', methods=['PUT'])
@swag_from(swagger_path, methods=['PUT'])
def update_video():
    """Update Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('', methods=['DELETE'])
@swag_from(swagger_path, methods=['DELETE'])
def delete_video():
    """Delete Video"""
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('/search', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def search_videos():
    """Search Videos"""
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('/report', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def report_video():
    """Report a Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501