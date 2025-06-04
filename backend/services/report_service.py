from repositories.report_repo import ReportRepo
from sqlalchemy.orm import Session


class ReportService:
    def __init__(self, db_session: Session):
        self.repo = ReportRepo(db_session)

    def create_video_report(self, video_id: int, report_reason: str):
        """Create a report for a video"""
        if not report_reason or not report_reason.strip():
            raise ValueError("Report reason is required.")

        if len(report_reason) > 100:
            raise ValueError("Report reason must be 100 characters or less.")

        return self.repo.create_report(
            video_id=video_id,
            report_reason=report_reason.strip()
        )

    def create_comment_report(self, comment_id: int, report_reason: str):
        """Create a report for a comment"""
        if not report_reason or not report_reason.strip():
            raise ValueError("Report reason is required.")

        if len(report_reason) > 100:
            raise ValueError("Report reason must be 100 characters or less.")

        return self.repo.create_report(
            comment_id=comment_id,
            report_reason=report_reason.strip()
        )

    def get_video_reports(self, video_id: int):
        """Get all reports for a video"""
        return self.repo.get_reports_by_video(video_id)

    def get_comment_reports(self, comment_id: int):
        """Get all reports for a comment"""
        return self.repo.get_reports_by_comment(comment_id)

    def get_all_reports(self, status: str = None):
        """Get all reports, optionally filtered by status"""
        valid_statuses = ["pending", "reviewed", "resolved", "dismissed"]
        if status and status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

        return self.repo.get_all_reports(status)

    def update_report_status(self, report_id: int, status: str):
        """Update the status of a report"""
        valid_statuses = ["pending", "reviewed", "resolved", "dismissed"]
        if status not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

        report = self.repo.update_report_status(report_id, status)
        if not report:
            raise ValueError("Report not found.")

        return report

    def get_video_report_count(self, video_id: int):
        """Get the count of reports for a video"""
        return self.repo.get_report_count_by_video(video_id)

    def get_comment_report_count(self, comment_id: int):
        """Get the count of reports for a comment"""
        return self.repo.get_report_count_by_comment(comment_id)
