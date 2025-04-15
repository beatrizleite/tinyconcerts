from flask import Blueprint, request, jsonify
from flasgger import swag_from

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/user')


@user_bp.route('', methods=['POST'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['POST'])
def create_user():
    """Create User"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@user_bp.route('', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_user_by_id():
    """Get User By Id"""
    user_id = request.args.get('user_id')
    return jsonify({"message": "Not implemented yet"}), 501


@user_bp.route('', methods=['PUT'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['PUT'])
def update_user():
    """Update User"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@user_bp.route('', methods=['DELETE'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['DELETE'])
def delete_user():
    """Delete User"""
    user_id = request.args.get('user_id')
    return jsonify({"message": "Not implemented yet"}), 501


@user_bp.route('/all', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_all_users():
    """Get All Users"""
    return jsonify({"message": "Not implemented yet"}), 501


@user_bp.route('/achievements', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_user_achievements():
    """Get User Achievement By Id"""
    return jsonify({"message": "Not implemented yet"}), 501