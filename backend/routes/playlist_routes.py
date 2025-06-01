from flask import Blueprint, request, jsonify
from flasgger import swag_from
from database import db_session
from flask_jwt_extended import jwt_required
from services.playlist_service import PlaylistService
import os

playlist_bp = Blueprint('playlist_bp', __name__, url_prefix='/api/playlist')
playlist_service = PlaylistService(db_session)
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..',
                                             'swagger', 'api_docs.yaml'))


@playlist_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def create_playlist():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    playlist = playlist_service.create_playlist(data)
    return jsonify(playlist.to_dict()), 201


@playlist_bp.route('', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def get_playlist_by_id():
    playlist_id = request.args.get('playlist_id')
    if not playlist_id:
        return jsonify({"error": "Missing playlist_id"}), 400

    playlist = playlist_service.get_playlist(int(playlist_id))
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404
    return jsonify(playlist.to_dict()), 200


@playlist_bp.route('', methods=['PUT'])
@swag_from(swagger_path, methods=['PUT'])
@jwt_required()
def update_playlist():
    playlist_id = request.args.get('playlist_id')
    data = request.get_json()
    if not playlist_id or not data:
        return jsonify({"error": "Missing playlist_id or JSON body"}), 400

    playlist = playlist_service.update_playlist(int(playlist_id), data)
    if not playlist:
        return jsonify({"error": "Playlist not found"}), 404
    return jsonify(playlist.to_dict()), 200


@playlist_bp.route('', methods=['DELETE'])
@swag_from(swagger_path, methods=['DELETE'])
@jwt_required()
def delete_playlist():
    playlist_id = request.args.get('playlist_id')
    if not playlist_id:
        return jsonify({"error": "Missing playlist_id"}), 400

    success = playlist_service.delete_playlist(int(playlist_id))
    if not success:
        return jsonify({"error": "Playlist not found"}), 404
    return jsonify({"message": "Playlist deleted"}), 200


@playlist_bp.route('/user', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def get_playlists_by_user():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    playlists = playlist_service.get_playlists_by_user(int(user_id))
    return jsonify([p.to_dict() for p in playlists]), 200
