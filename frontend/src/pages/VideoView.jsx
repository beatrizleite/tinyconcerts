import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import CommentSection from "../components/CommentSection";
import { ThumbsUp, Heart } from "lucide-react"
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer, Bounce } from "react-toastify";
import StarRating from "../components/ui/StarRating"

  
export default function VideoView() {
  const { isAuthenticated, token } = useAuth();
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [liked, setLiked] = useState(false)
  const [likeCooldown, setLikeCooldown] = useState(false);

  const [favorited, setFavorited] = useState(false);
  const [favoriteCooldown, setFavoriteCooldown] = useState(false);

  const [rating, setRating] = useState(0);
  const [ratingCooldown, setRatingCooldown] = useState(false);

useEffect(() => {
  const fetchVideo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca o vídeo
      const videoRes = await fetch(`${import.meta.env.VITE_API_URL}/api/video?video_id=${id}`);
      if (!videoRes.ok) throw new Error('Erro ao buscar vídeo');
      const videoData = await videoRes.json();
      setVideo(videoData);
      if (videoData.rating) setRating(videoData.rating);

      // Se não estiver autenticado, não verifica likes/favoritos
      if (!isAuthenticated || !token) return;

      // Busca likes e favoritos do utilizador
      const [likeRes, favRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/like/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/api/favorite/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const likesData = await likeRes.json();
      const favData = await favRes.json();

      // Extrai os IDs dos vídeos
      const likedIds = likesData.likes?.map(v => v.video_id) || [];
      const favoritedIds = favData.favorites?.map(v => v.video_id) || [];

      setLiked(likedIds.includes(parseInt(id)));
      setFavorited(favoritedIds.includes(parseInt(id)));

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchVideo();
  }
}, [id, isAuthenticated, token]);


 const handleLike = async () => {
  if (!isAuthenticated) {
    toast.warning("Please log in to like this video!");
    return;
  }
  if (likeCooldown) return;
  setLikeCooldown(true);

  const newLikeStatus = !liked;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        video_id: parseInt(id),
        like_status: newLikeStatus
      }),
    });

    if (!response.ok) throw new Error("Failed to like video");

    setLiked(newLikeStatus);
  } catch (err) {
    console.log(err);
  } finally {
    setTimeout(() => setLikeCooldown(false), 1000);
  }
}


const handleFavorite = async () => {
  if (!isAuthenticated) {
    toast.warning("Please log in to favorite this video!");
    return;
  }
  if (favoriteCooldown) return;
  setFavoriteCooldown(true);

  const newFavoriteStatus = !favorited;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        video_id: parseInt(id),
        favorite_status: newFavoriteStatus
      }),
    });

    if (!response.ok) throw new Error("Failed to favorite video");

    setFavorited(newFavoriteStatus);
  } catch (err) {
    console.log(err);
  } finally {
    setTimeout(() => setFavoriteCooldown(false), 1000);
  }
}



  const handleRating = async (newRating) => {
    if (!isAuthenticated) {
      toast.warning("Please log in to rate this video!");
      return;
    }
    if (ratingCooldown) return;
    setRatingCooldown(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rating`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          video_id: id,
          rating: newRating,
        }),
      });

      if (!response.ok) throw new Error("Failed to rate video");

      setRating(newRating);
      toast.success(`You rated this video ${newRating} stars!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit rating");
    } finally {
      setTimeout(() => setRatingCooldown(false), 1000);
    }
  };


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
          
          <div className="flex gap-4 mt-4 items-center">
            <button 
              onClick={handleLike}
              disabled={likeCooldown}
              className="flex flex-col items-center justify-center gap-1 cursor-pointer">
              <ThumbsUp fill={liked ? "#2e9aff" : "none"} /> Like
            </button>
            <button
              onClick={handleFavorite}
              disabled={favoriteCooldown}
              className="flex flex-col items-center justify-center gap-1 cursor-pointer">
              <Heart fill={favorited ? "#ff2e63" : "none"} /> Favorite
            </button>
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <StarRating
                  initialRating={rating}
                  onRate={handleRating}
                  disabled={ratingCooldown}
                />
                <span>Rate</span>
              </div>
            </div>
          </div>
          {video.description && (
            <div className="mt-4 p-4 bg-gray-800 rounded">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
            </div>
          )}

          <hr className="my-6 border-gray-700" />
          <CommentSection videoId={video.id} />
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-white text-lg">Video not found... &#128577;</p>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
}