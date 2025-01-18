import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { getAllVideos } from "../../store/slices/videoSlice";
import VideoCard from "./VideoCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { throttle } from "lodash";

function VideoDisplay({ limit = 16, sortBy = "views", sortType = "desc" }) {
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seenIds] = useState(new Set());

  const handleImageLoad = useCallback((videoId) => {
    setVideos((prev) =>
      prev.map((v) => (v._id === videoId ? { ...v, loaded: true } : v))
    );
  }, []);

  const fetchVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const fetchedVideosData = await dispatch(
        getAllVideos({
          page,
          limit,
          sortBy,
          sortType,
        })
      ).unwrap();

      setVideos((prevVideos) => {
        const newUniqueVideos = fetchedVideosData.videos
          .filter((video) => {
            if (seenIds.has(video._id)) {
              return false;
            }
            seenIds.add(video._id);
            return true;
          })
          .map((video) => ({
            ...video,
            loaded: false,
          }));

        if (newUniqueVideos.length === 0) {
          setHasMore(false);
          return prevVideos;
        }

        return [...prevVideos, ...newUniqueVideos];
      });

      if (
        !fetchedVideosData.hasNextPage ||
        fetchedVideosData.videos.length < limit
      ) {
        setHasMore(false);
      }

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError(error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [dispatch, page, hasMore, loading, seenIds]);

  const throttledFetchVideos = throttle(() => {
    fetchVideos();
  }, 1000);

  useEffect(() => {
    throttledFetchVideos();
  }, []);

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center w-full py-4 col-span-full">
      <div className="flex space-x-2">
        <div
          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-6">
        <div className="text-red-500 text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          Error loading videos: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {initialLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="grid"
          aria-label="Loading videos"
        >
          {Array.from({ length: limit }).map((_, index) => (
            <LoadingSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={videos.length}
          next={fetchVideos}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
          endMessage={
            <p className="text-center text-gray-500 p-4" role="status">
              You've reached the end
            </p>
          }
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="grid"
            aria-label="Video grid"
          >
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onImageLoad={handleImageLoad}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

export default VideoDisplay;
