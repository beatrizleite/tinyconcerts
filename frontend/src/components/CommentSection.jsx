import { useState } from "react";

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([
    { user: "Ana", content: "Adorei o concerto!" },
    { user: "João", content: "Muito bom som 🔥" }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([{ user: "Tu", content: newComment }, ...comments]);
    setNewComment("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Comentários</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreve um comentário..."
          className="w-full p-2 rounded bg-gray-700 text-white"
          rows={3}
        />
        <button type="submit" className="mt-2 bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">
          Comentar
        </button>
      </form>
      <div className="space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="bg-gray-800 p-3 rounded">
            <p className="font-semibold">{c.user}</p>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
