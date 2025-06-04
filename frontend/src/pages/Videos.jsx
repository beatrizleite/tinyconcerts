import React, { useState, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
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
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);

  const navigate = useNavigate();
  const handleNavigation = (videoId) => {
      navigate(`/video/${videoId}`);
  };
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL;
    
    fetch(`${baseUrl}/api/video/categories`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Categories endpoint not available');
      })
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => {
        console.log('Categories endpoint not available, will extract from videos');
        setCategories([]);
      });
    
    fetch(`${baseUrl}/api/video/owners`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Owners endpoint not available');
      })
      .then(data => setOwners(Array.isArray(data) ? data : []))
      .catch(err => {
        console.log('Owners endpoint not available, will extract from videos');
        setOwners([]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const baseUrl = import.meta.env.VITE_API_URL;
    
    const params = new URLSearchParams({
      page: currentPage.toString(),
      per_page: VIDEOS_PER_PAGE.toString(),
    });

    if (keyword.trim()) {
      params.append('q', keyword.trim());
    }
    if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    if (selectedOwner) {
      params.append('owner', selectedOwner);
    }
    if (dateFrom) {
      params.append('date_from', dateFrom);
    }
    if (dateTo) {
      params.append('date_to', dateTo);
    }

    const hasFilters = selectedCategory || selectedOwner || dateFrom || dateTo;
    const url = keyword.trim() === '' && !hasFilters
      ? `${baseUrl}/api/video/all?${params}`
      : `${baseUrl}/api/video/search?${params}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch videos');
        return res.json();
      })
      .then((data) => {
        const videoResults = data.results || [];
        setVideos(videoResults);
        setTotalVideos(data.total || 0);
        
        if (categories.length === 0 && videoResults.length > 0) {
          const uniqueCategories = [...new Set(videoResults.map(v => v.category).filter(Boolean))];
          setCategories(uniqueCategories.sort());
        }
        
        if (owners.length === 0 && videoResults.length > 0) {
          const uniqueOwners = [...new Set(videoResults.map(v => v.owner).filter(Boolean))];
          setOwners(uniqueOwners.sort());
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [keyword, currentPage, selectedCategory, selectedOwner, dateFrom, dateTo]);

  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  const handleClick = (video) => {
    handleNavigation(video.id);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    setKeyword(searchInput.trim());
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedOwner('');
    setDateFrom('');
    setDateTo('');
    setKeyword('');
    setSearchInput('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || selectedOwner || dateFrom || dateTo || keyword;

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

      {/* Search Bar */}
      <div onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
            className="px-3 py-2 rounded-l bg-gray-700 text-white w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button onClick={handleSearchSubmit} className="px-4 py-2 bg-red-500 rounded-r hover:bg-red-700 cursor-pointer transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          <Filter size={16} />
          Filters
          <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Owner</label>
              <select
                value={selectedOwner}
                onChange={(e) => {
                  setSelectedOwner(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Owners</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Published From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Published To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
              >
                <X size={14} />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap gap-2">
          {keyword && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 rounded-full text-sm">
              Search: "{keyword}"
              <button onClick={() => { setKeyword(''); setSearchInput(''); }} className="hover:bg-red-600 rounded-full">
                <X size={14} />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 rounded-full text-sm">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('')} className="hover:bg-blue-600 rounded-full">
                <X size={14} />
              </button>
            </span>
          )}
          {selectedOwner && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 rounded-full text-sm">
              Owner: {selectedOwner}
              <button onClick={() => setSelectedOwner('')} className="hover:bg-green-600 rounded-full">
                <X size={14} />
              </button>
            </span>
          )}
          {dateFrom && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500 rounded-full text-sm">
              From: {dateFrom}
              <button onClick={() => setDateFrom('')} className="hover:bg-purple-600 rounded-full">
                <X size={14} />
              </button>
            </span>
          )}
          {dateTo && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500 rounded-full text-sm">
              To: {dateTo}
              <button onClick={() => setDateTo('')} className="hover:bg-purple-600 rounded-full">
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {loading && <p>Loading videos...</p>}

      {!loading && videos.length === 0 && hasActiveFilters && (
        <p>No videos found matching your filters.</p>
      )}

      {/* Videos Grid */}
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
              <p className="text-xs text-gray-500">{video.published_at}</p>
              {video.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-gray-700 rounded text-xs">
                  {video.category}
                </span>
              )}
              {video.owner && (
                <p className="text-xs text-gray-400 mt-1">by {video.owner}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {getPageNumbers(currentPage, totalPages).map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-400 select-none">...</span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded cursor-pointer transition-colors ${
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