from flask import Blueprint, request, jsonify
from flasgger import swag_from
from database import db_session
from services.user_service import UserService

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/user')
user_service = UserService(db_session)

@user_bp.route('', methods=['POST'])
@swag_from('../swagger/api_docs.yaml', methods=['POST'])
def create_user():
    """Create User"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    user = user_service.createUser(data)
    return jsonify({"id": user.id, "username": user.username}), 201


@user_bp.route('', methods=['GET'])
@swag_from('../swagger/api_docs.yaml', methods=['GET'])
def get_user_by_id():
    """Get User By Id"""
    user_id_str = request.args.get('user_id')
    try:
        user_id = int(user_id_str)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid user_id"}), 400
    
    user = user_service.getUser(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user.id, "username": user.username}), 200


@user_bp.route('', methods=['PUT'])
@swag_from('../swagger/api_docs.yaml', methods=['PUT'])
def update_user():
    """Update User"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    user_id_str = request.args.get('user_id')
    try:
        user_id = int(user_id_str)
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid user_id"}), 400

    updated_user = user_service.updateUser(user_id, data)
    if not updated_user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"id": updated_user.id, "username": updated_user.username}), 200


@user_bp.route('', methods=['DELETE'])
@swag_from('../swagger/api_docs.yaml', methods=['DELETE'])
def delete_user():
    """Delete User"""
    user_id = request.args.get('user_id')
    success = user_service.deleteUser(user_id)
    if not success:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"message": "User deleted"}), 200


@user_bp.route('/all', methods=['GET'])
@swag_from('../swagger/api_docs.yaml', methods=['GET'])
def get_all_users():
    """Get All Users"""
    users = user_service.getAllUsers()
    return jsonify([{"id": u.id, "username": u.username} for u in users]),200


@user_bp.route('/achievements', methods=['GET'])
@swag_from('../swagger/api_docs.yaml', methods=['GET'])
def get_user_achievements():
    """Get User Achievement By Id"""
    return jsonify({"message": "Not implemented yet"}), 501