from flask import Blueprint, request, jsonify
from flasgger import swag_from

comment_bp = Blueprint('comment_bp', __name__, url_prefix='/api/comment')


@comment_bp.route('', methods=['PUT'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['PUT'])
def update_comment():
    """Update Comment"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501


@comment_bp.route('', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_comments_by_id():
    """Get Comments By Id"""
    comment_id = request.args.get('comment_id')
    return jsonify({"message": "Not implemented yet"}), 501


@comment_bp.route('', methods=['DELETE'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['DELETE'])
def delete_comment():
    """Delete Comment"""
    return jsonify({"message": "Not implemented yet"}), 501


@comment_bp.route('/video', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_comments_per_video():
    """Get Comments Per Video"""
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501


@comment_bp.route('/user', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_comments_per_user():
    """Get Comments Per User"""
    user_id = request.args.get('user_id')
    return jsonify({"message": "Not implemented yet"}), 501


@comment_bp.route('/report', methods=['POST'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['POST'])
def report_comment():
    """Report Comment"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501