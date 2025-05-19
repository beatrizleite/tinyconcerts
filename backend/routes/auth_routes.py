from flask import Blueprint, request, jsonify
from flasgger import swag_from

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')

@auth_bp.route('/logout', methods=['POST'])
@swag_from('../swagger/api_docs.yaml', methods=['POST'])
def logout():
    """Logout"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@auth_bp.route('/login', methods=['POST'])
@swag_from('../swagger/api_docs.yaml', methods=['POST'])
def login():
    """Login"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501
