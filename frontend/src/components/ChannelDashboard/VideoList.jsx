import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelVideos } from "../../store/slices/dashboardSlice";
import {
  deleteVideo,
  togglePublishStatus,
} from "../../store/slices/videoSlice";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VideoItem from "./VideoItem";
import { DeleteConfirmDialog } from "../index";

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

  const handleTogglePublish = async (videoId) => {
    try {
      await dispatch(togglePublishStatus(videoId)).unwrap();
      handleRefresh();
    } catch (error) {
      toast.error("Failed to update video status");
    }
  };

  const handleEdit = (videoId) => {
    navigate(`/video/edit/${videoId}`);
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

  return (
    <div className="bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a] border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl">
      <DeleteConfirmDialog
        deleteItemId={deleteVideoId}
        handleDeleteConfirm={handleDeleteConfirm}
        setDeleteItemId={setDeleteVideoId}
      />

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
            <VideoItem
              key={video._id}
              video={video}
              handleTogglePublish={handleTogglePublish}
              handleEdit={handleEdit}
              setDeleteVideoId={setDeleteVideoId}
            />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}

export default VideoList;
