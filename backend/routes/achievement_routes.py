from flask import Blueprint, request, jsonify
from flasgger import swag_from

achievement_bp = Blueprint('achievement_bp', 'achievement', url_prefix='/api/achievement')


@achievement_bp.route('')
@swag_from('../swagger/api_docs.yaml')
def update_achievement():
    """Update Achievement"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@achievement_bp.route('')
@swag_from('../swagger/api_docs.yaml')
def get_achievement():
    """Get Achievement"""
    return jsonify({"message": "Not implemented yet"}), 501
