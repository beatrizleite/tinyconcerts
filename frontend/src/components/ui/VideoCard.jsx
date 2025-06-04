import React, { useState } from 'react';
import { Play } from 'lucide-react';

const VideoCard = ({ video, onClick, isDragging, dragged }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = (e) => {
    if (isDragging || dragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick(video)
  }

  return (
    <div 
      className="flex-shrink-0 w-96 cursor-pointer group"
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
      onClick={handleClick}
    >
      <div className="relative mb-2 rounded-lg overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className={`w-full h-56 object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="w-full h-56 bg-gray-700 animate-pulse flex items-center justify-center rounded-lg">
            <div className="w-12 h-12 bg-gray-600 rounded"></div>
          </div>
        )}

        <div className="absolute inset-0 bg-black rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 flex items-center justify-center">
          <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
        </div>
      </div>
      
      <div className="px-2">
        <h3 className="text-white font-medium text-base leading-tight mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
          {video.title}
        </h3>
      </div>
    </div>
  );
};

export default VideoCard;
