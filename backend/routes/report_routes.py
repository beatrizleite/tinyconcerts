from flask import Blueprint, request, jsonify
from flasgger import swag_from
import os
from services.report_service import ReportService
from database import db_session
from flask_jwt_extended import jwt_required


report_bp = Blueprint('report_bp', __name__, url_prefix='/api/report')
report_service = ReportService(db_session)
swagger_path = os.path.normpath(os.path.join(os.path.dirname(__file__),
                                             '..', 'swagger', 'api_docs.yaml'))


@report_bp.route('', methods=['POST'])
@swag_from(swagger_path, methods=['POST'])
@jwt_required()
def create_report():
    """Create Report for Video or Comment"""
    data = request.get_json()
    if not data or 'report_reason' not in data:
        return jsonify({"error": "Missing required field: report_reason"}), 400

    video_id = data.get('video_id')
    comment_id = data.get('comment_id')

    if not video_id and not comment_id:
        return jsonify(
            {"error": "Either video_id or comment_id must be provided"}), 400

    if video_id and comment_id:
        return jsonify(
            {"error": "Cannot report both video and comment in the same request"}), 400

    try:
        report_reason = data['report_reason']

        if video_id:
            report = report_service.create_video_report(video_id,
                                                        report_reason)
            return jsonify({
                "message": "Video report submitted successfully.",
                "report_id": report.id
            }), 201
        else:
            report = report_service.create_comment_report(comment_id,
                                                          report_reason)
            return jsonify({
                "message": "Comment report submitted successfully.",
                "report_id": report.id
            }), 201

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@report_bp.route('/video/<int:video_id>', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def get_video_reports(video_id):
    """Get Reports for a Video (Admin only)"""
    try:
        reports = report_service.get_video_reports(video_id)
        return jsonify({
            "reports": [{
                "id": report.id,
                "report_reason": report.report_reason,
                "status": report.status
            } for report in reports]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@report_bp.route('/comment/<int:comment_id>', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def get_comment_reports(comment_id):
    """Get Reports for a Comment (Admin only)"""
    try:
        reports = report_service.get_comment_reports(comment_id)
        return jsonify({
            "reports": [{
                "id": report.id,
                "report_reason": report.report_reason,
                "status": report.status
            } for report in reports]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@report_bp.route('/all', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
@jwt_required()
def get_all_reports():
    """Get All Reports (Admin only)"""
    try:
        status_filter = request.args.get('status')
        reports = report_service.get_all_reports(status_filter)

        return jsonify({
            "reports": [{
                "id": report.id,
                "video_id": report.video_id,
                "comment_id": report.comment_id,
                "report_reason": report.report_reason,
                "status": report.status
            } for report in reports]
        }), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@report_bp.route('/<int:report_id>/status', methods=['PUT'])
@swag_from(swagger_path, methods=['PUT'])
@jwt_required()
def update_report_status(report_id):
    """Update Report Status (Admin only)"""
    data = request.get_json()
    if not data or 'status' not in data:
        return jsonify({"error": "Missing required field: status"}), 400

    try:
        status = data['status']
        report = report_service.update_report_status(report_id, status)

        return jsonify({
            "message": "Report status updated successfully.",
            "report": {
                "id": report.id,
                "status": report.status
            }
        }), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@report_bp.route('/count/video/<int:video_id>', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_video_report_count(video_id):
    """Get Report Count for a Video"""
    try:
        count = report_service.get_video_report_count(video_id)
        return jsonify({"report_count": count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@report_bp.route('/count/comment/<int:comment_id>', methods=['GET'])
@swag_from(swagger_path, methods=['GET'])
def get_comment_report_count(comment_id):
    """Get Report Count for a Comment"""
    try:
        count = report_service.get_comment_report_count(comment_id)
        return jsonify({"report_count": count}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
