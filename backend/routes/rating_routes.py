from flask import Blueprint, request, jsonify
from flasgger import swag_from

rating_bp = Blueprint('rating_bp', __name__, url_prefix='/api/rating')

@rating_bp.route('', methods=['POST'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['POST'])
def create_rating():
    """Create Rating for Video"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@rating_bp.route('', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_average_rating():
    """Get Average Rating for Video"""
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501
