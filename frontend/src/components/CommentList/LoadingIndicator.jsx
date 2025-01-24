import React from "react";

function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center w-full py-6">
      <div className="flex space-x-3">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default LoadingIndicator;
