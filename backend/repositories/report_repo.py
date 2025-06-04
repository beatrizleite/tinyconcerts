from models.report import Report
from sqlalchemy import func


class ReportRepo:
    def __init__(self, db_session):
        self.db = db_session

    def create_report(self, video_id: int = None,
                      comment_id: int = None,
                      report_reason: str = None):
        """Create a new report for video or comment"""
        new_report = Report(
            video_id=video_id,
            comment_id=comment_id,
            report_reason=report_reason,
            status="pending"
        )
        self.db.add(new_report)
        self.db.commit()
        self.db.refresh(new_report)
        return new_report

    def get_reports_by_video(self, video_id: int):
        """Get all reports for a specific video"""
        return (
            self.db.query(Report)
            .filter_by(video_id=video_id)
            .all()
        )

    def get_reports_by_comment(self, comment_id: int):
        """Get all reports for a specific comment"""
        return (
            self.db.query(Report)
            .filter_by(comment_id=comment_id)
            .all()
        )

    def get_all_reports(self, status: str = None):
        """Get all reports, optionally filtered by status"""
        query = self.db.query(Report)
        if status:
            query = query.filter_by(status=status)
        return query.all()

    def update_report_status(self, report_id: int, status: str):
        """Update the status of a report"""
        report = self.db.query(Report).filter_by(id=report_id).first()
        if report:
            report.status = status
            self.db.commit()
            self.db.refresh(report)
        return report

    def get_report_count_by_video(self, video_id: int):
        """Get the count of reports for a specific video"""
        return (
            self.db.query(func.count(Report.id))
            .filter_by(video_id=video_id)
            .scalar()
        )

    def get_report_count_by_comment(self, comment_id: int):
        """Get the count of reports for a specific comment"""
        return (
            self.db.query(func.count(Report.id))
            .filter_by(comment_id=comment_id)
            .scalar()
        )
