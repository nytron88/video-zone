import React from "react";
import { Eye, ThumbsUp, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Toggle = ({ isChecked, onChange, disabled }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-gray-400">Draft</span>
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
        isChecked ? "bg-purple-500" : "bg-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
          isChecked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
    <span className="text-sm text-gray-400">Published</span>
  </div>
);

function VideoItem({
  video,
  handleTogglePublish,
  handleEdit,
  setDeleteVideoId,
}) {
  return (
    <div className="group relative flex flex-col p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start gap-4">
        <Link
          to={`/video/${video._id}`}
          className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow duration-300"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        <div className="flex-grow min-w-0 space-y-2">
          <Link to={`/video/${video._id}`} className="block">
            <h3 className="text-white font-medium text-lg leading-tight line-clamp-2 hover:text-purple-500 transition-colors duration-200">
              {video.title}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-gray-400 text-sm">
              {new Date(video.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <Toggle
              isChecked={video.isPublished}
              onChange={() => handleTogglePublish(video._id, video.isPublished)}
              disabled={false}
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{video.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">
                {video.totalLikes.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4 border-t border-gray-700/50 pt-4">
        <button
          onClick={() => handleEdit(video._id)}
          className="p-2.5 text-gray-400 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors duration-200"
          title="Edit video"
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setDeleteVideoId(video._id)}
          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
          title="Delete video"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default VideoItem;
