from models.comment import Comment
from repositories.comment_repo import CommentRepo


class NotFoundError(Exception):
    pass


class CommentService:
    def __init__(self, db_session):
        self.repo = CommentRepo(db_session)

    def get_comment_by_id(self, comment_id: int) -> Comment:
        comment = self.repo.get_by_id(comment_id)
        if not comment:
            raise NotFoundError(f"Comment with id {comment_id} not found.")
        return comment

    def create_comment(self, data: dict) -> Comment:
        required_fields = ['user_id', 'video_id', 'comment_text']
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"{field} is required.")

        comment = Comment(
            user_id=data['user_id'],
            video_id=data['video_id'],
            comment_text=data['comment_text']
        )
        return self.repo.add(comment)

    def update_comment(self, comment_id: int, data: dict) -> Comment:
        comment = self.repo.get_by_id(comment_id)
        if not comment:
            raise NotFoundError(f"Comment with id {comment_id} not found.")

        if 'comment_text' in data:
            comment.comment_text = data['comment_text']

        return self.repo.update(comment)

    def delete_comment(self, comment_id: int) -> None:
        comment = self.repo.get_by_id(comment_id)
        if not comment:
            raise NotFoundError(f"Comment with id {comment_id} not found.")
        self.repo.delete(comment)

    def get_comments_per_video(self, video_id: int):
        return self.repo.get_comments_by_video(video_id)

    def get_comments_per_user(self, user_id: int):
        return self.repo.get_comments_by_user(user_id)
