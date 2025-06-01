import VideoCard from './ui/VideoCard';
import VideoCardSkeleton from './ui/VideoCardSkeleton';
import Carousel from './ui/Carousel';
import React, { useState, useEffect } from 'react';

const VideoSlider = ({ videos, title, onVideoClick }) => {
  const [timedOut, setTimedOut] = useState(false);

  const isLoading = videos.length === 0 && !timedOut;

  useEffect(() => {
    if (videos.length === 0) {
      const timer = setTimeout(() => {
        setTimedOut(true);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setTimedOut(false);
    }
  }, [videos]);

  return (
    <Carousel title={title}>
      {isLoading ? (
        [...Array(5)].map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))
      ) : videos.length > 0 ? (
        videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onClick={onVideoClick}
          />
        ))
      ) : (
        <p className="text-gray-400 px-4">No videos available.</p>
      )}
    </Carousel>
  );
};

export default VideoSlider;
