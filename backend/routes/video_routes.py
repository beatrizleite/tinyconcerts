from venv import logger
from flask import Blueprint, request, jsonify
from flasgger import swag_from
from flask_jwt_extended import (jwt_required,
                                verify_jwt_in_request,
                                get_jwt_identity)
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
    user_id = None
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
    except Exception:
        pass
    try:
        video = video_service.get_video_by_id(int(video_id), user_id=user_id)
    except FileNotFoundError:
        return jsonify({"message": "Video not found"}), 404
    return jsonify(video), 200


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
@jwt_required()
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
def search_videos_paginated():
    """Search videos with filters"""
    keyword = request.args.get('q', '').strip()
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    category = request.args.get('category', '').strip()
    owner = request.args.get('owner', '').strip()
    date_from = request.args.get('date_from', '').strip()
    date_to = request.args.get('date_to', '').strip()

    filters = {}
    if category:
        filters['category'] = category
    if owner:
        filters['owner'] = owner
    if date_from:
        filters['date_from'] = date_from
    if date_to:
        filters['date_to'] = date_to

    try:
        videos, total = video_service.search_videos_with_filters(
            keyword=keyword if keyword else None,
            filters=filters,
            page=page,
            per_page=per_page
        )

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
        } for v in videos]

        return jsonify({
            "results": videos_list,
            "total": total,
            "page": page,
            "per_page": per_page
        }), 200

    except Exception as e:
        logger.error(f"Error in search_videos_paginated: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500


@video_bp.route('/categories', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_categories():
    """Get all unique categories"""
    try:
        categories = video_service.get_all_categories()
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@video_bp.route('/owners', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_owners():
    """Get all unique owners"""
    try:
        owners = video_service.get_all_owners()
        return jsonify(owners), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@video_bp.route('/report', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def report_video():
    """Report a Video"""
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


@video_bp.route('/import', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def import_videos_from_excel():
    """Import Videos from Excel/CSV file"""
    if 'file' not in request.files:
        return jsonify({"error": "Missing file in request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file name"}), 400

    try:
        created_videos = video_service.import_videos_from_file(file)
        return jsonify({
            "message": f"Imported {len(created_videos)} videos successfully!",
            "created_video_ids": created_videos
        }), 201
    except Exception as e:
        return jsonify({"error": f"Failed to import videos: {str(e)}"}), 500


@video_bp.route('/random', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_random_videos():
    """Get 10 random videos"""
    videos = video_service.get_random_videos(limit=10)
    return jsonify([video.to_dict() for video in videos]), 200


@video_bp.route('/most-liked', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_most_liked_videos():
    """Get 10 videos with most likes"""
    videos_with_likes = video_service.get_most_liked_videos(limit=10)
    result = []
    for video, likes_count in videos_with_likes:
        data = video.to_dict()
        data['likes'] = likes_count
        result.append(data)
    return jsonify(result), 200


@video_bp.route('/most-recent', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_most_recent_videos():
    """Get 10 most recent videos"""
    videos = video_service.get_most_recent_videos(limit=10)
    return jsonify([video.to_dict() for video in videos]), 200


@video_bp.route('/all', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_all_videos():
    """Get all videos with optional filters"""
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)

    category = request.args.get('category', '').strip()
    owner = request.args.get('owner', '').strip()
    date_from = request.args.get('date_from', '').strip()
    date_to = request.args.get('date_to', '').strip()

    filters = {}
    if category:
        filters['category'] = category
    if owner:
        filters['owner'] = owner
    if date_from:
        filters['date_from'] = date_from
    if date_to:
        filters['date_to'] = date_to

    try:
        videos, total = video_service.get_all_videos_with_filters(
            filters=filters,
            page=page,
            per_page=per_page
        )

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
            } for v in videos]

        return jsonify({
            "results": videos_list,
            "total": total,
            "page": page,
            "per_page": per_page
        }), 200

    except Exception as e:
        logger.error(f"Error in search_videos_paginated: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500
