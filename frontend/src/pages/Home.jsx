import React from 'react';
import VideoSlider from '../components/VideoSlider'

export default function Home() {
  const sampleVideos = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `Sample Video ${i + 1} - This is a longer title to test text wrapping`,
    thumbnail: `https://picsum.photos/192/108?random=${i + 1}`,
    duration: `${Math.floor(Math.random() * 20 + 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    views: `${(Math.random() * 10).toFixed(1)}M`,
    uploadTime: `${Math.floor(Math.random() * 30 + 1)} days ago`
  }));

  const handleVideoClick = (video) => {
    console.log('Video clicked:', video);
    // Add your navigation logic here, e.g.:
    // router.push(`/video/${video.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <VideoSlider 
          videos={sampleVideos}
          title="Featured Videos"
          onVideoClick={handleVideoClick}
        />
        
        <VideoSlider 
          videos={sampleVideos}
          title="Trending Now"
          onVideoClick={handleVideoClick}
        />
        
        <VideoSlider 
          videos={sampleVideos}
          title="Recently Added"
          onVideoClick={handleVideoClick}
        />
     </div>
  );
}