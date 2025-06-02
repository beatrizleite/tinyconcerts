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
    getRandomVideos()
      .then(data => setRandomVideos(data.map(mapBackendVideoToFrontend)))
      .catch(err => console.error('Failed to fetch random videos:', err));

    getMostLikedVideos()
      .then(data => setMostLikedVideos(data.map(mapBackendVideoToFrontend)))
      .catch(err => console.error('Failed to fetch most liked videos:', err));

    getMostRecentVideos()
      .then(data => setMostRecentVideos(data.map(mapBackendVideoToFrontend)))
      .catch(err => console.error('Failed to fetch most recent videos:', err));
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

