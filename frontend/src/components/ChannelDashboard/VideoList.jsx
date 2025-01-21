import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelVideos } from "../../store/slices/dashboardSlice";
import {
  deleteVideo,
  togglePublishStatus,
} from "../../store/slices/videoSlice";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { Eye, ThumbsUp, Edit2, Trash2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VideoList() {
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state) => state.user);

  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const seenIds = useMemo(() => new Set(), []);
  const LIMIT = 10;
  const navigate = useNavigate();

  const fetchVideos = useCallback(
    async (pageNum, isRefresh = false) => {
      try {
        const fetchedData = await dispatch(
          getChannelVideos({
            username: userData.username,
            page: pageNum,
            limit: LIMIT,
          })
        ).unwrap();

        setVideos((prevVideos) => {
          if (isRefresh) return fetchedData;

          const newUniqueVideos = fetchedData.filter((video) => {
            if (seenIds.has(video._id)) return false;
            seenIds.add(video._id);
            return true;
          });

          return [...prevVideos, ...newUniqueVideos];
        });

        if (fetchedData.length < LIMIT) {
          setHasMore(false);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch videos");
        setHasMore(false);
      } finally {
        setIsLoading(false);
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [dispatch, userData._id, seenIds]
  );

  useEffect(() => {
    fetchVideos(1);
    return () => seenIds.clear();
  }, [fetchVideos, seenIds]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    seenIds.clear();
    await fetchVideos(1, true);
  };

  const handleLoadMore = async () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchVideos(nextPage);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteVideoId) {
      try {
        await dispatch(deleteVideo(deleteVideoId));
        toast.success("Video deleted successfully");
        handleRefresh();
      } catch (error) {
        toast.error("Failed to delete video");
      } finally {
        setDeleteVideoId(null);
      }
    }
  };

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      await dispatch(togglePublishStatus(videoId)).unwrap();
      handleRefresh();
    } catch (error) {
      toast.error("Failed to update video status");
    }
  };

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

  const DeleteConfirmDialog = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        deleteVideoId ? "" : "hidden"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#1e1e1e] border border-gray-700 rounded-lg p-6 max-w-sm w-full relative">
        <h3 className="text-white text-lg font-semibold mb-4">Delete Video</h3>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this video? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteVideoId(null)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:ring focus:ring-purple-500"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring focus:ring-red-500"
            aria-label="Delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const handleEdit = (videoId) => {
    navigate(`/dashboard/videos/edit/${videoId}`);
  };

  const LoadingIndicator = () => (
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

  const VideoSkeleton = () => (
    <div className="flex flex-col p-4 bg-black/30 rounded-xl border border-gray-700 gap-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0" />
        <div className="flex-grow space-y-3">
          <div className="h-6 bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-700 rounded w-1/2" />
          <div className="flex gap-4">
            <div className="h-4 bg-gray-700 rounded w-16" />
            <div className="h-4 bg-gray-700 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );

  const VideoItem = ({ video }) => (
    <div className="group relative flex flex-col p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 group-hover:shadow-md transition-shadow duration-300">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="flex-grow min-w-0 space-y-2">
          <h3 className="text-white font-medium text-lg leading-tight line-clamp-2">
            {video.title}
          </h3>
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

  return (
    <div className="bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a] border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl">
      <DeleteConfirmDialog />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl text-white font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          Your Videos
        </h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <VideoSkeleton key={index} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={videos.length}
          next={handleLoadMore}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
          endMessage={
            <p className="text-center text-gray-400 py-6">
              {videos.length === 0 ? (
                <span className="block space-y-2">
                  <span className="block text-lg font-medium">
                    No videos yet
                  </span>
                  <span className="block text-sm">
                    Start uploading to see them here!
                  </span>
                </span>
              ) : (
                "You've reached the end"
              )}
            </p>
          }
          className="space-y-4"
        >
          {videos.map((video) => (
            <VideoItem key={video._id} video={video} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}

export default VideoList;
