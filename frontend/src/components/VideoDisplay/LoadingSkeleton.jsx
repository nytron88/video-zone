import React, { memo } from "react";

const LoadingSkeleton = memo(() => (
  <div
    className="group relative bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-800 p-4 smooth-pulse"
    role="gridcell"
    aria-label="Loading video"
  >
    <div className="relative aspect-video bg-gray-700 rounded-lg"></div>
    <div className="mt-4 h-4 bg-gray-700 rounded"></div>
    <div className="mt-2 h-4 bg-gray-700 rounded w-3/4"></div>
    <div className="mt-4 flex items-center space-x-4">
      <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
));

LoadingSkeleton.displayName = "LoadingSkeleton";

export default LoadingSkeleton;
