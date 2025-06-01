from .achievement_routes import achievement_bp
from .auth_routes import auth_bp
from .comment_routes import comment_bp
from .like_routes import like_bp
from .favorite_routes import favorite_bp
from .playlist_routes import playlist_bp
from .playlist_video_routes import playlist_video_bp
from .rating_routes import rating_bp
from .report_routes import report_bp
from .user_routes import user_bp
from .video_routes import video_bp


def register_routes(app):
    app.register_blueprint(achievement_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(comment_bp)
    app.register_blueprint(like_bp)
    app.register_blueprint(favorite_bp)
    app.register_blueprint(playlist_bp)
    app.register_blueprint(playlist_video_bp)
    app.register_blueprint(rating_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(video_bp)
