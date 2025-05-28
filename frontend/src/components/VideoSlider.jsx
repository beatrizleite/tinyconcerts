import VideoCard from './ui/VideoCard';
import VideoCardSkeleton from './ui/VideoCardSkeleton';
import Carousel from './ui/Carousel';
import React, { useState, useEffect } from 'react';

const VideoSlider = ({ videos, title, onVideoClick }) => {
  const [timedOut, setTimedOut] = useState(false);

  // Consider loading as true if no videos and not timed out
  const isLoading = videos.length === 0 && !timedOut;

  useEffect(() => {
    if (videos.length === 0) {
      // Start timer only if videos are empty
      const timer = setTimeout(() => {
        setTimedOut(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    } else {
      // If videos arrive before timeout, reset timedOut
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
