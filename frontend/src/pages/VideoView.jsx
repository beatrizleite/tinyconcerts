import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import CommentSection from "../components/CommentSection";

export default function VideoView() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // 🔹 Simulação de API, trocar por fetch(`/api/videos/${id}`)
    const fetchVideo = async () => {
      const res = {
        id,
        title: "Concerto Exemplo",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        views: 1234,
        uploaded: "2024-05-20",
      };
      setVideo(res);
    };
    fetchVideo();
  }, [id]);

  if (!video) return <p className="text-white">A carregar vídeo...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
      <p className="text-gray-400 mb-4">{video.views} visualizações · {video.uploaded}</p>

      <VideoPlayer url={video.url} />

      <div className="flex gap-4 mt-4">
        <button className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">Like</button>
        <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Favorito</button>
        <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Reportar</button>
      </div>

      <hr className="my-6 border-gray-700" />
      <CommentSection videoId={video.id} />
    </div>
  );
}
