from models.comment import Comment
from sqlalchemy.orm import Session
from sqlalchemy import desc


class CommentRepo:
    def __init__(self, db_session: Session):
        self.db = db_session

    def get_by_id(self, comment_id: int) -> Comment | None:
        return self.db.query(Comment).get(comment_id)

    def add(self, comment: Comment) -> Comment:
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def update(self, comment: Comment) -> Comment:
        self.db.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def delete(self, comment: Comment) -> None:
        self.db.delete(comment)
        self.db.commit()

    def get_comments_by_video(self, video_id: int):
        return self.db.query(Comment).filter(Comment.video_id == video_id).order_by(desc(Comment.id)).all()

    def get_comments_by_user(self, user_id: int):
        return self.db.query(Comment).filter(Comment.user_id == user_id).order_by(desc(Comment.id)).all()
