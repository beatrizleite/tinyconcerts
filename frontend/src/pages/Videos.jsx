import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VIDEOS_PER_PAGE = 12;

export default function Videos() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const mockVideos = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Concerto #${i + 1}`,
    thumbnail: `https://placehold.co/320x180?text=Video+${i + 1}`,
    duration: '4:20',
    views: Math.floor(Math.random() * 5000),
    uploadTime: '2024-05-01',
  }));

  const indexOfLastVideo = currentPage * VIDEOS_PER_PAGE;
  const indexOfFirstVideo = indexOfLastVideo - VIDEOS_PER_PAGE;
  const currentVideos = mockVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(mockVideos.length / VIDEOS_PER_PAGE);

  const handleClick = (video) => {
    navigate(`/video/${video.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Todos os Vídeos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleClick(video)}
            className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
              <p className="text-sm text-gray-400">{video.views} visualizações</p>
              <p className="text-xs text-gray-500">{video.uploadTime}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'} hover:bg-indigo-500`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
