import VideoCard from './ui/VideoCard';
import VideoCardSkeleton from './ui/VideoCardSkeleton';
import Carousel from './ui/Carousel';
import React from 'react';

const VideoSlider = ({ videos, title, onVideoClick }) => {
  const isLoading = videos.length === 0;

  return (
    <Carousel title={title}>
      {isLoading
        ? [...Array(5)].map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))
        : videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={onVideoClick}
            />
          ))}
    </Carousel>
  );
};

export default VideoSlider;
