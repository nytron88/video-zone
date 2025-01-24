import React from "react";

function CommentSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-gray-700/50 animate-pulse">
      <div className="w-10 h-10 bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-700 rounded w-3/4" />
      </div>
    </div>
  );
}

export default CommentSkeleton;
