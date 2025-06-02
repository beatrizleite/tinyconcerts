from flask import Blueprint, request, jsonify
from flasgger import swag_from
import os
from services.rating_service import RatingService
from database import db_session
from flask_jwt_extended import jwt_required, get_jwt_identity


rating_bp = Blueprint('rating_bp', __name__, url_prefix='/api/rating')
rating_service = RatingService(db_session)
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@rating_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def create_rating():
    """Create Rating for Video"""
    data = request.get_json()
    if not data or 'video_id' not in data or 'rating' not in data:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        user_id = get_jwt_identity()
        video_id = data['video_id']
        rating = data['rating']
        rating_service.create_rating(user_id, video_id, rating)
        return jsonify({"message": "Rating submitted successfully."}), 201
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": e}), 500


@rating_bp.route('', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_average_rating():
    """Get Average Rating for Video"""
    video_id = request.args.get('video_id')
    if not video_id:
        return jsonify({"error": "Missing video_id"}), 400

    try:
        average = rating_service.get_average_rating(video_id)
        if average is None:
            return jsonify({"average_rating": 0.0}), 200
        return jsonify({"average_rating": average}), 200
    except Exception as e:
        return jsonify({"error": e}), 500
