from flask import Blueprint, request, jsonify
from flasgger import swag_from
from flask_jwt_extended import jwt_required
from database import db_session
from services.video_service import VideoService
import os
import datetime

video_bp = Blueprint('video_bp', __name__, url_prefix='/api/video')
video_service = VideoService(db_session)
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@video_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def create_video():
    """Create Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    if not data.get('published_at'):
        data['published_at'] = datetime.utcnow().date().fromisoformat()

    video = video_service.create_video(data)
    return jsonify({"message": "Video created!", "video_id": video.id}), 201


@video_bp.route('', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_video_by_id():
    """Get Video By Id"""
    video_id = request.args.get('video_id')
    if not video_id or not video_id.isdigit():
        return jsonify({"error": "Missing or invalid video_id"}), 400

    video = video_service.get_video_by_id(int(video_id))
    if not video:
        return jsonify({"message": "Video not found"}), 404

    video_data = {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "video_link": video.video_link,
        "category": video.category,
        "published_at": video.published_at,
        "owner": video.owner,
        "owner_url": video.owner_url,
        "image_320_180": video.image_320_180
    }
    return jsonify(video_data), 200


@video_bp.route('', methods=['PUT'])
@swag_from(swagger_path, methods=['PUT'])
@jwt_required()
def update_video():
    """Update Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    video_id = data.get('id')
    if not video_id:
        return jsonify({"message": "Missing video id"}), 400

    updated_video = video_service.update_video(int(video_id), data)
    if not updated_video:
        return jsonify({"message": "Video not found"}), 404
    return jsonify({"message": "Video updated"}), 200


@video_bp.route('', methods=['DELETE'])
@swag_from(swagger_path, methods=['DELETE'])
@jwt_required
def delete_video():
    """Delete Video"""
    video_id = request.args.get('video_id')
    if not video_id or not video_id.isdigit():
        return jsonify({"error": "Missing or invalid video_id"}), 400
    success = video_service.delete_video(int(video_id))
    if not success:
        return jsonify({"error": "Video not found"}), 404
    return jsonify({"message": "Video deleted"}), 200


@video_bp.route('/search', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def search_videos():
    """Search Videos"""
    keyword = request.args.get('q')
    if not keyword:
        return jsonify({"error": "Missing search keyword parameter 'q'"}), 400

    results = video_service.search_videos(keyword)
    videos_list = [{
        "id": v.id,
        "title": v.title,
        "description": v.description,
        "video_link": v.video_link,
        "category": v.category,
        "published_at": v.published_at,
        "owner": v.owner,
        "owner_url": v.owner_url,
        "image_320_180": v.image_320_180
    } for v in results]
    return jsonify({"results": videos_list}), 200


@video_bp.route('/report', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def report_video():
    """Report a Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    video_id = data.get('video_id')
    reason = data.get('reason')
    if not video_id or not reason:
        return jsonify({"error": "Missing video_id or reason"}), 400
    return jsonify(
        {"message": f"Video {video_id} reported for reason: {reason}"}
    ), 200
