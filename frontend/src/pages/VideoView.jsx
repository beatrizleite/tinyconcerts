import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import CommentSection from "../components/CommentSection";

export default function VideoView() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/video?video_id=${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Video not found');
          }
          throw new Error('Error while loading video');
        }
        
        const videoData = await response.json();
        setVideo(videoData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      {error && (
        <div className="text-center py-8">
          <p className="text-red-400 text-lg">Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4 w-3/4"></div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-1"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
            <div className="h-4 bg-gray-700 rounded w-1"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>

          <div className="aspect-video w-full bg-gray-700 rounded mb-4"></div>

          <div className="mt-4 p-4 bg-gray-800 rounded">
            <div className="h-6 bg-gray-700 rounded mb-2 w-24"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5"></div>
              <div className="h-4 bg-gray-700 rounded w-3/5"></div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="h-10 bg-gray-700 rounded w-20"></div>
            <div className="h-10 bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-gray-700 rounded w-24"></div>
          </div>

          <hr className="my-6 border-gray-700" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-32"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      ) : video ? (
        <>
          <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-400 mb-4">
            <span>{video.like_count} likes</span>
            <span>•</span>
            <span>Published in {formatDate(video.published_at)}</span>
            {video.owner && (
              <>
                <span>•</span>
                <span>
                  {video.owner_url ? (
                    <a href={video.owner_url} className="text-indigo-400 hover:text-indigo-300">
                      {video.owner}
                    </a>
                  ) : (
                    video.owner
                  )}
                </span>
              </>
            )}
          </div>

          <VideoPlayer url={video.video_link} />

          {video.description && (
            <div className="mt-4 p-4 bg-gray-800 rounded">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
            </div>
          )}

          <div className="flex gap-4 mt-4">
            <button className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">
              Like ({video.like_count})
            </button>
            <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
              Favorito
            </button>
            <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">
              Reportar
            </button>
          </div>

          <hr className="my-6 border-gray-700" />
          <CommentSection videoId={video.id} />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-white text-lg">Video not found... &#128577;</p>
        </div>
      )}
    </div>
  );
}