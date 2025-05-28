import VideoCard from './ui/VideoCard'
import Carousel from './ui/Carousel'
import React from 'react';

const VideoSlider = ({ videos, title, onVideoClick }) => {
  return (
    <Carousel title={title}>
      {videos.map((video) => (
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