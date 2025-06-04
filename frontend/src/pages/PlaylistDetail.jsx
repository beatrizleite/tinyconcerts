import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, X, Check, Trash2, ArrowLeft, Edit3, MoreVertical } from 'lucide-react';
import Modal from '../components/ui/Modal';

const VIDEOS_PER_PAGE = 12;

export default function PlaylistDetail() {
  const [playlist, setPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [totalPlaylistVideos, setTotalPlaylistVideos] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [playlistSearchQuery, setPlaylistSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [totalSearchVideos, setTotalSearchVideos] = useState(0);
  const [searching, setSearching] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [adding, setAdding] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get('playlist_id');

  useEffect(() => {
    console.log('PlaylistDetail mounted:', { isAuthenticated, token, playlistId });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      console.log('Not authenticated, redirecting to home');
      navigate('/');
      return;
    }

    if (!playlistId) {
      console.log('No playlist ID, redirecting to playlists');
      navigate('/playlists');
      return;
    }

    console.log('Fetching playlist details for ID:', playlistId);
    fetchPlaylistDetails();
  }, [isAuthenticated, token, playlistId]);

  useEffect(() => {
    if (playlist) {
      console.log('Playlist loaded, fetching videos:', playlist);
      fetchPlaylistVideos();
    }
  }, [playlist, currentPage, playlistSearchQuery]);

  const fetchPlaylistDetails = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/playlist/video/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Playlist details response:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/');
          return;
        }
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Playlist data received:', data);
      setPlaylist(data);
      setEditName(data.name);
    } catch (err) {
      console.error('Fetch playlist error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylistVideos = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      let url = `${baseUrl}/api/playlist/video/${playlistId}/?page=${currentPage}&per_page=${VIDEOS_PER_PAGE}`;
      
      if (playlistSearchQuery.trim()) {
        url += `&search=${encodeURIComponent(playlistSearchQuery)}`;
      }

      console.log('Fetching playlist videos from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Playlist videos response:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist videos: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Playlist videos data:', data);
      setPlaylistVideos(data.videos || []);
      setTotalPlaylistVideos(data.videos?.length || 0);
    } catch (err) {
      console.error('Fetch playlist videos error:', err);
      setError(err.message);
    }
  };

  const handlePlaylistSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setPlaylistSearchQuery(searchQuery.trim());
  };

  const handleVideoClick = (video) => {
    navigate(`/video/${video.id}`);
  };

  const removeVideoFromPlaylist = async (videoId) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/playlist/video/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playlist_id: parseInt(playlistId),
          video_id: videoId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to remove video from playlist');
      }

      fetchPlaylistVideos();
    } catch (err) {
      console.error('Remove video error:', err);
      setError(err.message);
    }
  };

  const searchVideosToAdd = async (query, page = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalSearchVideos(0);
      return;
    }

    setSearching(true);
    
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
        throw new Error(`Failed to search videos: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results || []);
      setTotalSearchVideos(data.total || 0);
      setSearchCurrentPage(page);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('searchQuery');
    setSearchCurrentPage(1);
    searchVideosToAdd(query, 1);
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

  const addSelectedVideos = async () => {
    if (selectedVideos.length === 0) return;

    setAdding(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const addVideoPromises = selectedVideos.map(async (video) => {
        const response = await fetch(`${baseUrl}/api/playlist/video/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            playlist_id: parseInt(playlistId),
            video_id: video.id
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to add video "${video.title}" to playlist`);
        }
        
        return response.json();
      });

      await Promise.all(addVideoPromises);
      
      setSelectedVideos([]);
      setSearchResults([]);
      setShowAddModal(false);
      
      fetchPlaylistVideos();
    } catch (err) {
      console.error('Add videos error:', err);
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const editPlaylistName = async () => {
    if (!editName.trim() || editName.trim() === playlist.name) {
      setShowEditModal(false);
      return;
    }

    setEditing(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/playlist?playlist_id=${playlistId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: editName.trim()
        })
        });

      if (!response.ok) {
        throw new Error('Failed to update playlist name');
      }

      setPlaylist(prev => ({ ...prev, name: editName.trim() }));
      setShowEditModal(false);
    } catch (err) {
      console.error('Edit playlist error:', err);
      setError(err.message);
    } finally {
      setEditing(false);
    }
  };

  const deletePlaylist = async () => {
    setDeleting(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/playlist/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }

      navigate('/playlists');
    } catch (err) {
      console.error('Delete playlist error:', err);
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const totalPlaylistPages = Math.ceil(totalPlaylistVideos / VIDEOS_PER_PAGE);
  const totalSearchPages = Math.ceil(totalSearchVideos / VIDEOS_PER_PAGE);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="text-center">
          <p className="text-lg">Loading playlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">Error: {error}</p>
          <button
            onClick={() => navigate('/playlists')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="text-center">
          <p className="text-lg text-red-400">Playlist not found</p>
          <button
            onClick={() => navigate('/playlists')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/playlists')}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold">{playlist.name}</h1>
            <p className="text-gray-400">
              {totalPlaylistVideos} video{totalPlaylistVideos !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 cursor-pointer"
          >
            <Plus size={20} />
            <span>Add Videos</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="flex items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200 cursor-pointer"
            >
              <MoreVertical size={20} />
            </button>
            {showOptionsMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowOptionsMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Edit3 size={16} />
                  <span>Edit Name</span>
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowOptionsMenu(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 cursor-pointer"
                >
                  <Trash2 size={16} />
                  <span>Delete Playlist</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search bar for playlist videos */}
      <form onSubmit={handlePlaylistSearch} className="mb-6">
        <div className="flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search videos in this playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-red-500 text-white rounded-r-lg hover:bg-red-600 transition duration-200 cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Playlist videos grid */}
      {playlistVideos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-300 mb-6">
            {playlistSearchQuery ? `No videos found for "${playlistSearchQuery}"` : 'This playlist is empty'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 cursor-pointer"
          >
            Add Videos
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlistVideos.map((video) => (
              <div
                key={video.id}
                className="relative bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1 group"
              >
                <div 
                  onClick={() => handleVideoClick(video)}
                  className="cursor-pointer"
                >
                  <img 
                    src={video.image_320_180} 
                    alt={video.title} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-400">{video.views ?? 'N/A'} views</p>
                    <p className="text-xs text-gray-500">{video.published_at}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVideoFromPlaylist(video.id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 bg-opacity-75 hover:bg-opacity-100 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPlaylistPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {getPageNumbers(currentPage, totalPlaylistPages).map((page, idx) =>
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
        </>
      )}

      {/* Add Videos Modal */}
      <Modal isOpen={showAddModal} onClose={() => {
        setShowAddModal(false);
        setSearchResults([]);
        setSelectedVideos([]);
      }}>
        <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Add Videos to Playlist</h2>
            <button
              onClick={() => {
                setShowAddModal(false);
                setSearchResults([]);
                setSelectedVideos([]);
              }}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search for videos to add..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-3 bg-red-500 text-white rounded-r-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 cursor-pointer"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Selected videos count */}
          {selectedVideos.length > 0 && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400">
                {selectedVideos.length} video{selectedVideos.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Search results */}
          {searchResults.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {searchResults.map((video) => {
                  const isSelected = selectedVideos.some(v => v.id === video.id);
                  const isInPlaylist = playlistVideos.some(v => v.id === video.id);
                  
                  return (
                    <div
                      key={video.id}
                      className={`relative bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 group ${
                        isSelected ? 'ring-2 ring-green-500' : 
                        isInPlaylist ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                      }`}
                      onClick={() => !isInPlaylist && toggleVideoSelection(video)}
                    >
                      <img 
                        src={video.image_320_180} 
                        alt={video.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-medium text-sm mb-1 truncate">{video.title}</h3>
                        <p className="text-xs text-gray-400 truncate">{video.owner}</p>
                      </div>
                      {isInPlaylist && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Already in playlist</span>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                      {!isSelected && !isInPlaylist && (
                        <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-75 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Search pagination */}
              {totalSearchPages > 1 && (
                <div className="flex justify-center space-x-2 mb-6">
                  {Array.from({ length: Math.min(totalSearchPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => searchVideosToAdd(document.querySelector('input[name="searchQuery"]').value, page)}
                        className={`px-3 py-1 rounded cursor-pointer ${
                          searchCurrentPage === page
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setShowAddModal(false);
                setSearchResults([]);
                setSelectedVideos([]);
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={addSelectedVideos}
              disabled={adding || selectedVideos.length === 0}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {adding ? 'Adding...' : `Add ${selectedVideos.length} Video${selectedVideos.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-white mb-4">Edit Playlist Name</h2>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            placeholder="Enter playlist name"
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={editPlaylistName}
              disabled={editing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            >
              {editing ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-white mb-4">Delete Playlist</h2>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={deletePlaylist}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 cursor-pointer"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}