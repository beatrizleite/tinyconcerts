from flask import Blueprint, request, jsonify
from flasgger import swag_from
import os

achievement_bp = Blueprint('achievement_bp', 'achievement',
                           url_prefix='/api/achievement')
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@achievement_bp.route('')
@swag_from(swagger_path, methods=['PUT'])
def update_achievement():
    """Update Achievement"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@achievement_bp.route('')
@swag_from(swagger_path, methods=['GET'])
def get_achievement():
    """Get Achievement"""
    return jsonify({"message": "Not implemented yet"}), 501
