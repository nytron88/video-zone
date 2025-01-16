import { ArrowUpRight } from "lucide-react";
import { formatDate } from "../../services/formatFigures";
import { Link } from "react-router-dom";
import React, { memo } from "react";

const VideoCard = memo(({ video, onImageLoad }) => (
  <Link
    to={`/video/${video._id}`}
    className="group relative bg-gray-900/80 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-800 hover:border-cyan-500/50 transition-all duration-300"
    role="gridcell"
    tabIndex={0}
    aria-label={`Watch ${video.title}`}
  >
    <div
      className={`relative aspect-video overflow-hidden transform transition-opacity duration-500 ${
        video.loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={video.thumbnail}
        alt={`Thumbnail for ${video.title}`}
        loading="lazy"
        onLoad={() => onImageLoad(video._id)}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold line-clamp-2 flex-1 mr-2">
          {video.title}
        </h3>
        <ArrowUpRight className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-400">
          <span className="font-medium text-cyan-400">{video.views} views</span>
          <span className="mx-2">&bull;</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden">
            <img
              src={video.owner.avatar}
              alt={`${video.owner.username}'s avatar`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-300">{video.owner.username}</span>
        </div>
      </div>
    </div>
  </Link>
));

VideoCard.displayName = "VideoCard";

export default VideoCard;
