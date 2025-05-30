/* import { useEffect, useState } from "react";
import { getRandomVideos } from "../api"; // mais tarde trocar por getAllVideos(page)

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const videosPerPage = 12;

  const mapBackendVideoToFrontend = (video) => ({
    id: video.id,
    thumbnail: video.image_320_180,
    title: video.title,
    duration: video.duration || "0:00",
    views: video.views || 0,
    uploadTime: video.published_at,
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await getRandomVideos(); // substituir por getAllVideos(page)
        const mapped = data.map(mapBackendVideoToFrontend);
        const start = (page - 1) * videosPerPage;
        const paginated = mapped.slice(start, start + videosPerPage);
        setVideos(paginated);
      } catch (err) {
        console.error("Erro ao buscar vídeos:", err);
      }
    };

    fetchVideos();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1); // limite real virá do backend depois
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Todos os Vídeos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-gray-800 rounded shadow p-3">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold">{video.title}</h2>
            <p className="text-sm text-gray-400">{video.views} views</p>
            <p className="text-sm text-gray-500">{video.uploadTime}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-white font-bold self-center">Página {page}</span>
        <button
          onClick={handleNextPage}
          className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
        >
          Seguinte
        </button>
      </div>
    </div>
  );
} */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoSlider from '../components/VideoSlider';
import { getRandomVideos, getMostLikedVideos, getMostRecentVideos } from '../api';

export default function Home() {
  const [randomVideos, setRandomVideos] = useState([]);
  const [mostLikedVideos, setMostLikedVideos] = useState([]);
  const [mostRecentVideos, setMostRecentVideos] = useState([]);
  const navigate = useNavigate();

  const mapBackendVideoToFrontend = (video) => ({
    id: video.id,
    thumbnail: video.image_320_180,
    title: video.title,
    duration: video.duration || '0:00',
    views: video.views || 0,
    uploadTime: video.published_at,
  });

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const [random, liked, recent] = await Promise.all([
          getRandomVideos(),
          getMostLikedVideos(),
          getMostRecentVideos()
        ]);
        setRandomVideos(random.map(mapBackendVideoToFrontend));
        setMostLikedVideos(liked.map(mapBackendVideoToFrontend));
        setMostRecentVideos(recent.map(mapBackendVideoToFrontend));
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <VideoSlider 
        videos={randomVideos}
        title="Featured Videos"
        onVideoClick={handleVideoClick}
      />
      
      <VideoSlider 
        videos={mostLikedVideos}
        title="Trending Now"
        onVideoClick={handleVideoClick}
      />
      
      <VideoSlider 
        videos={mostRecentVideos}
        title="Recently Added"
        onVideoClick={handleVideoClick}
      />
    </div>
  );
}

