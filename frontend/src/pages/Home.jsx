import React, { useEffect, useState } from 'react';
import VideoSlider from '../components/VideoSlider';
import { getRandomVideos, getMostLikedVideos, getMostRecentVideos } from '../api';

export default function Home() {
  const [randomVideos, setRandomVideos] = useState([]);
  const [mostLikedVideos, setMostLikedVideos] = useState([]);
  const [mostRecentVideos, setMostRecentVideos] = useState([]);

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
    console.log('Video clicked:', video);
    // will route to video/{id}
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
