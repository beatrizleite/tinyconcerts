import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/ui/Modal';
import Login from './Login';

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated, token, user } = useAuth();

  // Wait for auth to settle before making API calls
  useEffect(() => {
    const authTimer = setTimeout(() => {
      setAuthLoading(false);
    }, 100);

    return () => clearTimeout(authTimer);
  }, []);

  useEffect(() => {
    // Don't make API calls until auth has settled
    if (authLoading) return;
    
    if (!isAuthenticated || !token) {
      setPlaylists([]);
      setLoading(false);
      return;
    }

    fetchPlaylists();
  }, [isAuthenticated, token, authLoading]);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Get user ID from auth context or localStorage as fallback
      let userId = user?.id || user?.user_id;
      if (!userId) {
        userId = localStorage.getItem('user_id');
        if (!userId) {
          throw new Error('User ID not found. Please log in again.');
        }
      }

      console.log('Fetching playlists for user ID:', userId);

      const response = await fetch(`${baseUrl}/api/playlist/user?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please log in again.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch playlists: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Playlists fetched:', data);
      setPlaylists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch playlists error:', err);
      setError(err.message);
      
      // If authentication error, clear the playlists
      if (err.message.includes('Authentication')) {
        setPlaylists([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist?playlist_id=${playlist.id}`);
  };

  const handleCreatePlaylist = () => {
    if (!isAuthenticated || !token) {
      setShowLoginModal(true);
      return;
    }
    navigate('/createplaylist');
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Refresh playlists after successful login
    if (isAuthenticated && token) {
      fetchPlaylists();
    }
  };

  // Show loading while auth is settling
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-3xl font-bold mb-6">My Playlists</h1>
        <div className="text-center py-12">
          <p className="text-xl text-gray-300 mb-6">You need to be logged in to view your playlists.</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200 cursor-pointer"
          >
            Login
          </button>
        </div>
        
        <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
          <Login onSuccess={handleLoginSuccess} />
        </Modal>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Playlists</h1>
        {(isAuthenticated && token) && !error && (
          <button
            onClick={handleCreatePlaylist}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
          >
            Create New Playlist
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">Error: {error}</p>
          {error.includes('Authentication') && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 cursor-pointer"
            >
              Login Again
            </button>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <p className="text-lg">Loading playlists...</p>
        </div>
      )}

      {!loading && !error && playlists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-300 mb-6">You don't have any playlists yet.</p>
          <button
            onClick={handleCreatePlaylist}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition duration-200 cursor-pointer"
          >
            Create Your First Playlist
          </button>
        </div>
      )}

      {!loading && playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist)}
              className="cursor-pointer bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-center h-32 bg-gray-700 rounded-lg mb-4">
                  <svg 
                    className="w-12 h-12 text-gray-400" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-center">{playlist.name}</h3>
                <p className="text-sm text-gray-400 text-center">
                  {playlist.videos ? playlist.videos.length : 0} videos
                </p>
                {playlist.created_at && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Created {new Date(playlist.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login onSuccess={handleLoginSuccess} />
      </Modal>
    </div>
  );
}