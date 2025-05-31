import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Edit2, Trash2 } from "lucide-react";
import { ToastContainer } from "react-toastify";

export default function CommentSection({ videoId }) {
  const { isAuthenticated, token, username } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comment/video?video_id=${videoId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setComments([]);
            return;
          }
          throw new Error('Error loading comments');
        }

        const commentsData = await response.json();
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          video_id: parseInt(videoId),
          comment_text: newComment.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      const newCommentData = await response.json();

      const commentWithUserData = {
        ...newCommentData,
        first_name: newCommentData?.first_name || 'Anonymous',
        last_name: newCommentData?.last_name || '',
        username: newCommentData?.username || 'user'
      };

      setComments([commentWithUserData, ...comments]);
      setNewComment("");

    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comment?comment_id=${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: commentId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments(comments.filter(comment => comment.id !== commentId));

    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment.id);
    setEditText(comment.comment_text);
  };

  const handleSaveEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: commentId,
          comment_text: editText.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      setComments(comments.map(comment =>
        comment.id === commentId
          ? { ...comment, comment_text: editText.trim() }
          : comment
      ));

      setEditingComment(null);
      setEditText("");

    } catch (err) {
      console.error('Error updating comment:', err);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  const isUserComment = (comment) => {
    console.log(username);
    return comment.username === username;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      {showLoginAlert && (
        <div className="mb-4 p-3 bg-yellow-600 text-white rounded flex items-center justify-between">
          <span>You have to be logged in to comment</span>
          <button
            onClick={() => setShowLoginAlert(false)}
            className="text-white hover:text-gray-200 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newComment.trim() || submitting}
        >
          {submitting ? 'Posting...' : 'Comment'}
        </button>
      </form>

      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-800 p-3 rounded">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-400 text-center py-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {comments.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <p className="text-lg">No comments</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-800 p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-indigo-400">
                      {comment.first_name} {comment.last_name}
                    </p>
                    <span className="text-gray-500 text-sm">@{comment.username}</span>
                  </div>

                  {isUserComment(comment) && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                        title="Edit comment"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-indigo-500 focus:outline-none"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                        disabled={!editText.trim()}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-200">{comment.comment_text}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
