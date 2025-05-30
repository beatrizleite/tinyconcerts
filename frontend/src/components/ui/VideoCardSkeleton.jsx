import React from 'react';

const VideoCardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-96 animate-pulse">
      <div className="relative mb-2 rounded-lg overflow-hidden">
        <div className="w-full h-56 bg-gray-700 rounded-lg"></div>
      </div>
      <div className="px-2 space-y-1">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
