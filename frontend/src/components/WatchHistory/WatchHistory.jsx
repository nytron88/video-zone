import React, { useEffect, useState } from "react";
import {
  getUserWatchHistory,
  deleteVideoFromWatchHistory,
} from "../../store/slices/watchHistorySlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { ToastContainer } from "../index";
import { formatYouTubeTime, formatDate } from "../../services/formatFigures";
import { X, Clock, Eye, Calendar, History } from "lucide-react";

const LoadingIndicator = () => (
  <div className="flex justify-center items-center w-full py-6 col-span-full">
    <div className="flex space-x-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "1s",
          }}
        ></div>
      ))}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <History className="w-16 h-16 text-gray-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-200 mb-2">
      No Watch History
    </h3>
    <p className="text-gray-400 text-center max-w-md">
      Videos you watch will appear here. Start exploring some content!
    </p>
  </div>
);

function WatchHistory() {
  const dispatch = useDispatch();
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deleteInProgress, setDeleteInProgress] = useState(new Set());

  const groupVideosByDay = (videos) => {
    const today = new Date();
    const grouped = {};

    videos.forEach((video) => {
      const videoDate = new Date(video.watchedAt);
      let dateLabel;

      if (videoDate.toDateString() === today.toDateString()) {
        dateLabel = "Today";
      } else if (
        videoDate.toDateString() ===
        new Date(today.setDate(today.getDate() - 1)).toDateString()
      ) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = formatDate(videoDate);
      }

      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }
      grouped[dateLabel].push(video);
    });

    return grouped;
  };

  const fetchWatchHistory = async (pageNum) => {
    try {
      setLoading(true);
      const response = await dispatch(
        getUserWatchHistory({ page: pageNum })
      ).unwrap();

      const newVideos = response.videos;

      if (newVideos.length === 0) {
        setHasMore(false);
      }

      setWatchHistory((prev) =>
        pageNum === 1 ? newVideos : [...prev, ...newVideos]
      );
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchHistory(1);
  }, []);

  const fetchMoreData = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWatchHistory(nextPage);
  };

  const removeVideo = async (videoId) => {
    setDeleteInProgress((prev) => new Set(prev).add(videoId));
    try {
      await dispatch(deleteVideoFromWatchHistory(videoId)).unwrap();
      setWatchHistory((prev) => prev.filter((video) => video._id !== videoId));
      toast.success("Video removed from watch history");
    } catch (error) {
      toast.error(error.message || "Failed to remove video");
    } finally {
      setDeleteInProgress((prev) => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
    }
  };

  if (loading && page === 1) {
    return <LoadingIndicator />;
  }

  const groupedVideos = groupVideosByDay(watchHistory);

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Watch History
          </h1>
          <p className="text-gray-400 mt-2">
            Your video journey, organized by date
          </p>
        </div>

        <ToastContainer />

        {watchHistory.length === 0 && !loading ? (
          <EmptyState />
        ) : (
          <InfiniteScroll
            dataLength={watchHistory.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<LoadingIndicator />}
            endMessage={
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">You've reached the end</p>
              </div>
            }
          >
            {Object.entries(groupedVideos).map(([date, videos]) => (
              <div key={date} className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="text-cyan-400 w-5 h-5" />
                  <h2 className="text-2xl font-semibold text-gray-200">
                    {date}
                  </h2>
                </div>
                <div className="space-y-6">
                  {videos.map((video) => (
                    <div
                      key={`${video._id}-${video.watchedAt}`}
                      className="group bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <Link
                          to={`/video/${video._id}`}
                          className="flex-shrink-0 relative w-full md:w-64 aspect-video overflow-hidden rounded-lg group-hover:ring-2 ring-cyan-400/30 transition-all"
                        >
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                            {formatYouTubeTime(video.duration)}
                          </span>
                        </Link>

                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-grow">
                              <Link
                                to={`/video/${video._id}`}
                                className="text-gray-100 font-semibold text-lg hover:text-cyan-400 transition-colors line-clamp-2"
                              >
                                {video.title}
                              </Link>
                              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                {video.description}
                              </p>
                            </div>
                            <button
                              className={`p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors ${
                                deleteInProgress.has(video._id)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => removeVideo(video._id)}
                              disabled={deleteInProgress.has(video._id)}
                            >
                              <X size={20} />
                            </button>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-4">
                            <Link
                              to={`/channel/${video.owner.username}`}
                              className="flex items-center gap-2 group/channel"
                            >
                              <img
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                className="w-8 h-8 rounded-full ring-2 ring-transparent group-hover/channel:ring-cyan-400 transition-all"
                              />
                              <span className="text-gray-300 group-hover/channel:text-cyan-400 transition-colors">
                                {video.owner.username}
                              </span>
                            </Link>

                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {video.views.toLocaleString()} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDate(video.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default WatchHistory;
