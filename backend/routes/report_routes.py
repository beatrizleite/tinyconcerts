from flask import Blueprint, request, jsonify
from flasgger import swag_from

report_bp = Blueprint('report_bp', __name__, url_prefix='/api/report')

@report_bp.route('', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_all_reports():
    """Get All Reports"""
    return jsonify({"message": "Not implemented yet"}), 501


@report_bp.route('/video', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_reports_for_video():
    """Get Reports For Video"""
    video_id = request.args.get('video_id')
    return jsonify({"message": "Not implemented yet"}), 501


@report_bp.route('/comment', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_reports_for_comment():
    """Get Reports For Comment"""
    comment_id = request.args.get('comment_id')
    return jsonify({"message": "Not implemented yet"}), 501


@report_bp.route('/user', methods=['GET'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['GET'])
def get_reports_by_user():
    """Get Reports Made By User"""
    user_id = request.args.get('user_id')
    return jsonify({"message": "Not implemented yet"}), 501


@report_bp.route('/status', methods=['PATCH'])
@swag_from('..\\swagger\\api_docs.yaml', methods=['PATCH'])
def update_report_status():
    """Update Report Status"""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
    return jsonify({"message": "Not implemented yet"}), 501
