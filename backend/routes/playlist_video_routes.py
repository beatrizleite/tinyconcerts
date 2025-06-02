from flask import Blueprint, request, jsonify
from services.playlist_video_service import PlaylistVideoService
from repositories.playlist_repo import PlaylistRepo
from repositories.video_repo import VideoRepo
from repositories.playlist_video_repo import PlaylistVideoRepo
from database import db_session

playlist_video_bp = Blueprint('playlist_video_bp', __name__,
                              url_prefix='/api/playlist/video')

playlist_repo = PlaylistRepo(db_session)
video_repo = VideoRepo(db_session)
playlist_video_repo = PlaylistVideoRepo(db_session)
playlist_video_service = PlaylistVideoService(playlist_repo,
                                              video_repo,
                                              playlist_video_repo)


@playlist_video_bp.route('/add', methods=['POST'])
def add_video_to_playlist():
    data = request.get_json()
    playlist_id = data.get('playlist_id')
    video_id = data.get('video_id')

    if not playlist_id or not video_id:
        return jsonify({"error": "Missing playlist_id or video_id"}), 400

    try:
        entry = playlist_video_service.add_video_to_playlist(db_session,
                                                             playlist_id,
                                                             video_id)
        return jsonify({
            "message": "Video added to playlist",
            "entry": {
                "id": entry.id,
                "playlist_id": entry.playlist_id,
                "video_id": entry.video_id
            }
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@playlist_video_bp.route('/remove', methods=['POST'])
def remove_video_from_playlist():
    data = request.get_json()
    playlist_id = data['playlist_id']
    video_id = data['video_id']

    if not playlist_id or not video_id:
        return jsonify({"error": "Missing playlist_id or video_id"}), 400

    try:
        playlist_video_service.remove_video_from_playlist(db_session,
                                                          playlist_id,
                                                          video_id)
        return jsonify({"message": "Video removed from playlist"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
