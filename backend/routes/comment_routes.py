from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flasgger import swag_from
from database import db_session
import os

from services.comment_service import CommentService, NotFoundError

comment_bp = Blueprint('comment_bp', __name__, url_prefix='/api/comment')
comment_service = CommentService(db_session)
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..',
                                             'swagger', 'api_docs.yaml'))


@comment_bp.route('', methods=['PUT'])
@jwt_required()
@swag_from(swagger_path, methods=['PUT'])
def update_comment():
    """Update Comment"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    comment_id = data.get('id')
    if not comment_id:
        return jsonify({"error": "Missing comment id"}), 400

    try:
        comment = comment_service.update_comment(int(comment_id), data)
        return jsonify({
            "message": "Comment updated",
            "id": comment.id
        })
    except NotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@comment_bp.route('', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_comments_by_id():
    """Get Comment By Id"""
    comment_id = request.args.get('comment_id')
    if not comment_id:
        return jsonify({"error": "Missing comment_id"}), 400

    try:
        comment = comment_service.get_comment_by_id(int(comment_id))
        return jsonify({
            "id": comment.id,
            "user_id": comment.user_id,
            "video_id": comment.video_id,
            "comment_text": comment.comment_text
        })
    except NotFoundError as e:
        return jsonify({"error": str(e)}), 404


@comment_bp.route('', methods=['DELETE'])
@jwt_required()
@swag_from(swagger_path, methods=['DELETE'])
def delete_comment():
    """Delete Comment"""
    comment_id = request.args.get('comment_id')
    if not comment_id:
        return jsonify({"error": "Missing comment_id"}), 400

    try:
        comment_service.delete_comment(int(comment_id))
        return jsonify({"message": "Comment deleted"})
    except NotFoundError as e:
        return jsonify({"error": str(e)}), 404


@comment_bp.route('/video', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_comments_per_video():
    """Get Comments Per Video"""
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    result = comment_service.get_comments_per_video(int(video_id))
    return jsonify(result)


@comment_bp.route('/user', methods=['GET'])
@jwt_required()
@swag_from(swagger_path, methods=['GET'])
def get_comments_per_user():
    """Get Comments Per User"""
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    comments = comment_service.get_comments_per_user(int(user_id))
    result = [
        {
            "id": c.id,
            "user_id": c.user_id,
            "video_id": c.video_id,
            "comment_text": c.comment_text
        } for c in comments
    ]
    return jsonify(result)


@comment_bp.route('/report', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
def report_comment():
    """Report Comment"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    return jsonify({"message": "Report feature not implemented"}), 501


@comment_bp.route('', methods=['POST'])
@jwt_required()
@swag_from(swagger_path, methods=['POST'])
def create_comment():
    """Create Comment"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    try:
        user_id = get_jwt_identity()
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        data['user_id'] = user_id

        comment = comment_service.create_comment(data)
        return jsonify(comment), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
