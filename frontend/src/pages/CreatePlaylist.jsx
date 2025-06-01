import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, X, Check } from 'lucide-react';

const VIDEOS_PER_PAGE = 12;

export default function CreatePlaylist() {
  const [playlistName, setPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated || !token) {
        navigate('/');
      } else {
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, token, navigate]);

  const searchVideos = async (query, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalVideos(0);
      return;
    }

    if (!token) {
      setError('Authentication required');
      return;
    }

    setSearching(true);
    setError('');
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${baseUrl}/api/video/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${VIDEOS_PER_PAGE}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication expired. Please log in again.');
          navigate('/');
          return;
        }
        throw new Error(`Failed to search videos: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
      setTotalVideos(data.total || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchVideos(searchQuery, 1);
  };

  const toggleVideoSelection = (video) => {
    setSelectedVideos(prev => {
      const isSelected = prev.some(v => v.id === video.id);
      if (isSelected) {
        return prev.filter(v => v.id !== video.id);
      } else {
        return [...prev, video];
      }
    });
  };

  const removeSelectedVideo = (videoId) => {
    setSelectedVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      setError('Please enter a playlist name');
      return;
    }

    if (!token) {
      setError('Authentication required');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      let userId = user?.id || user?.user_id;
      if (!userId) {
        userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found. Please log in again.');
        }
      }

      console.log('Creating playlist with user ID:', userId);

      const playlistResponse = await fetch(`${baseUrl}/api/playlist`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName.trim(),
          user_id: parseInt(userId)
        })
      });

      if (!playlistResponse.ok) {
        if (playlistResponse.status === 401) {
          setError('Authentication expired. Please log in again.');
          navigate('/');
          return;
        }
        const errorData = await playlistResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create playlist: ${playlistResponse.statusText}`);
      }
      
      const playlist = await playlistResponse.json();
      console.log('Playlist created:', playlist);

      if (selectedVideos.length > 0) {
        console.log('Adding videos to playlist:', selectedVideos.length);
        
        const addVideoPromises = selectedVideos.map(async (video) => {
          const response = await fetch(`${baseUrl}/api/video/playlist/add`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              playlist_id: playlist.id,
              video_id: video.id
            })
          });

          if (!response.ok) {
            console.error(`Failed to add video ${video.id} to playlist`);
            throw new Error(`Failed to add video "${video.title}" to playlist`);
          }
          
          return response.json();
        });

        await Promise.all(addVideoPromises);
        console.log('All videos added successfully');
      }

      navigate('/playlists');
    } catch (err) {
      console.error('Create playlist error:', err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const totalPages = Math.ceil(totalVideos / VIDEOS_PER_PAGE);

  const handlePageChange = (page) => {
    searchVideos(searchQuery, page);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Create New Playlist</h1>
          <button
            onClick={() => navigate('/playlists')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <label className="block text-lg font-semibold mb-3">Playlist Name</label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name..."
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        {selectedVideos.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Selected Videos ({selectedVideos.length})
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={video.image_320_180} 
                      alt={video.title}
                      className="w-16 h-9 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-video.jpg';
                      }}
                    />
                    <span className="font-medium truncate">{video.title}</span>
                  </div>
                  <button
                    onClick={() => removeSelectedVideo(video.id)}
                    className="text-red-400 hover:text-red-600 transition duration-200 cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Videos</h2>
          
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for videos to add..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={searching || !token}
                className="px-6 py-3 bg-red-500 text-white rounded-r-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 cursor-pointer"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {searchResults.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {searchResults.map((video) => {
                  const isSelected = selectedVideos.some(v => v.id === video.id);
                  return (
                    <div
                      key={video.id}
                      className={`relative bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group ${
                        isSelected ? 'ring-2 ring-green-500' : 'hover:bg-gray-600'
                      }`}
                      onClick={() => toggleVideoSelection(video)}
                    >
                      <img 
                        src={video.image_320_180} 
                        alt={video.title}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-video.jpg'; // Fallback image
                        }}
                      />
                      <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 truncate">{video.title}</h3>
                        <p className="text-xs text-gray-400 truncate">{video.owner}</p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      {!isSelected && (
                        <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded cursor-pointer ${
                          currentPage === page
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-3 py-1 text-gray-400">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-1 rounded cursor-pointer${
                          currentPage === totalPages
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {searchQuery && searchResults.length === 0 && !searching && (
            <p className="text-gray-400 text-center py-8">
              No videos found for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/playlists')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePlaylist}
            disabled={creating || !playlistName.trim() || !token}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </div>
    </div>
  );
}