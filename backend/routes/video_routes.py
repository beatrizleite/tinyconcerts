from flask import Blueprint, request, jsonify
from flasgger import swag_from

video_bp = Blueprint('video_bp', __name__, url_prefix='/api/video')


@video_bp.route('', methods=['POST'])
@swag_from('../swagger/api_docs.yaml', methods=['POST'])
def create_video():
    """Create Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('', methods=['GET'])
@swag_from('../swagger/api_docs.yaml', methods=['GET'])
def get_video_by_id():
    """Get Video By Id"""
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('', methods=['PUT'])
@swag_from('../swagger/api_docs.yaml', methods=['PUT'])
def update_video():
    """Update Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('', methods=['DELETE'])
@swag_from('../swagger/api_docs.yaml', methods=['DELETE'])
def delete_video():
    """Delete Video"""
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('/search', methods=['GET'])
@swag_from('../swagger/api_docs.yaml', methods=['GET'])
def search_videos():
    """Search Videos"""
    return jsonify({"message": "Not implemented yet"}), 501


@video_bp.route('/report', methods=['POST'])
@swag_from('../swagger/api_docs.yaml', methods=['POST'])
def report_video():
    """Report a Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501