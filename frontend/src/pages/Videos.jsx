import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VIDEOS_PER_PAGE = 12;

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = keyword.trim() === ''
    ? `${baseUrl}/api/video/all?page=${currentPage}&per_page=${VIDEOS_PER_PAGE}`
      : `${baseUrl}/api/video/search?q=${encodeURIComponent(keyword)}&page=${currentPage}&per_page=${VIDEOS_PER_PAGE}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      })
      .then((data) => {
        setVideos(data.results);
        setTotalVideos(data.total);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [keyword, currentPage]);

  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  const handleClick = (video) => {
    navigate(`/video/${video.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setKeyword(searchInput.trim());
  };

  function getPageNumbers(currentPage, totalPages) {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) pages.push(i);
        pages.push('...');
      } else if (currentPage >= totalPages - 3) {
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) pages.push(i);
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  }


  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">All Videos</h1>

      <form onSubmit={handleSearchSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Pesquisar vídeos..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-3 py-2 rounded-l bg-gray-700 text-white w-64"
        />
        <button type="submit" className="px-4 py-2 bg-red-500 rounded-r hover:bg-red-700 cursor-pointer">
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {loading && <p>Loading videos...</p>}

      {!loading && videos.length === 0 && keyword && <p>No videos found for "{keyword}"</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => handleClick(video)}
            className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <img src={video.image_320_180} alt={video.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
              <p className="text-sm text-gray-400">{video.views ?? 'N/A'} views</p>
              <p className="text-xs text-gray-500">{video.published_at}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {getPageNumbers(currentPage, totalPages).map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-400 select-none">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded cursor-pointer ${
                  currentPage === page
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-red-700'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
