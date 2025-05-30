from flask import Blueprint, request, jsonify
from flasgger import swag_from
import os

playlist_bp = Blueprint('playlist_bp', __name__, url_prefix='/api/playlist')
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@playlist_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def create_playlist():
    """Create Playlist"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@playlist_bp.route('', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_playlist_by_id():
    """Get Playlist by Id"""
    playlist_id = request.args.get('playlist_id')
    return jsonify({"message": "Not implemented yet"}), 501


@playlist_bp.route('', methods=['PUT'])
@swag_from(swagger_path, methods=['PUT'])
def update_playlist():
    """Update Playlist"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@playlist_bp.route('', methods=['DELETE'])
@swag_from(swagger_path, methods=['DELETE'])
def delete_playlist():
    """Delete Playlist"""
    playlist_id = request.args.get('playlist_id')
    return jsonify({"message": "Not implemented yet"}), 501


@playlist_bp.route('/user', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_playlists_by_user():
    """Get Playlists By User"""
    user_id = request.args.get('user_id')
    return jsonify({"message": "Not implemented yet"}), 501


@playlist_bp.route('/video', methods=['DELETE'])
@swag_from(swagger_path, methods=['DELETE'])
def delete_video_from_playlist():
    """Delete Video From Playlist"""
    playlist_id = request.args.get('playlist_id')
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501
