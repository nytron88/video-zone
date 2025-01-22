import React from "react";
import { LikedVideos as LikedVideosComponent } from "../components";

function LikedVideos() {
  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 text-center">Liked Videos</h1>
        <p className="text-gray-400 text-center mb-8">
          Your collection of favorite videos, curated just for you.
        </p>
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <LikedVideosComponent />
        </div>
      </div>
    </div>
  );
}

export default LikedVideos;
