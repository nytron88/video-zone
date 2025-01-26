import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { searchVideosAndChannels } from "../../store/slices/videoSlice";

const LoadingIndicator = memo(() => (
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
));

const ErrorMessage = memo(({ message }) => (
  <div className="text-red-500 text-center mb-4 p-4 bg-red-500/10 rounded">
    {message}
  </div>
));

const ChannelCard = memo(({ channel }) => (
  <Link
    to={`/channel/${channel.username}`}
    key={channel._id}
    className="block bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors"
  >
    <div className="flex items-center gap-4 p-4">
      <img
        src={channel.avatar || "/api/placeholder/80/80"}
        alt={channel.username}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        {channel.fullName && (
          <h3 className="text-white font-medium text-lg mb-1 truncate">
            {channel.fullName}
          </h3>
        )}
        <h4 className="text-gray-300 font-medium text-base mb-2 truncate">
          @{channel.username}
        </h4>
        <p className="text-gray-400 text-sm">
          {channel.subscribersCount?.toLocaleString() || "0"} subscribers
        </p>
      </div>
    </div>
  </Link>
));

const VideoCard = memo(({ video }) => (
  <Link
    to={`/video/${video._id}`}
    key={video._id}
    className="block bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-900 transition-colors"
  >
    <div className="flex flex-col md:flex-row">
      <div className="relative w-full md:w-64 aspect-video md:aspect-auto md:h-36 flex-shrink-0">
        <img
          src={video.thumbnail || "/api/placeholder/400/225"}
          alt={video.title || "Video Thumbnail"}
          className="w-full h-full object-cover"
        />
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
            {video.duration}
          </div>
        )}
      </div>
      <div className="flex-1 p-4">
        <h3 className="text-white font-medium text-lg mb-2 line-clamp-2">
          {video.title || "Untitled Video"}
        </h3>
        <Link
          to={`/channel/${video.owner?.username}`}
          className="flex items-center gap-3 mb-2 hover:text-gray-300 group"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={video.owner?.avatar || "/api/placeholder/40/40"}
            alt={video.owner?.username || "Channel Avatar"}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-gray-400 text-sm group-hover:text-gray-300">
            {video.owner?.username || "Unknown Channel"}
          </span>
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm flex-wrap">
          <span>{video.views?.toLocaleString() || "0"} views</span>
          <span>•</span>
          <span>
            {video.createdAt
              ? new Date(video.createdAt).toLocaleString()
              : "Unknown Date"}
          </span>
        </div>
      </div>
    </div>
  </Link>
));

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [results, setResults] = useState({ videos: [], channels: [] });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  const query = useMemo(() => searchParams.get("query") || "", [searchParams]);

  const fetchResults = useCallback(
    async (pageNum, reset = false) => {
      if (!query) return;

      try {
        setLoading(true);
        setError(null);

        const response = await dispatch(
          searchVideosAndChannels({
            query,
            type: "all",
            limit: 20,
            sortBy: "score",
            page: pageNum,
          })
        ).unwrap();

        const newVideos = response.videos || [];
        const newChannels = response.channels || [];

        setResults((prev) => ({
          videos: reset ? newVideos : [...prev.videos, ...newVideos],
          channels: reset ? newChannels : [...prev.channels, ...newChannels],
        }));

        setHasMore(newVideos.length === 20);
      } catch (error) {
        setError("Failed to fetch results. Please try again.");
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, query]
  );

  useEffect(() => {
    setResults({ videos: [], channels: [] });
    setPage(1);
    setHasMore(true);
    fetchResults(1, true);
  }, [query, fetchResults]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(nextPage);
  }, [loading, hasMore, page, fetchResults]);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-6">
      {error && <ErrorMessage message={error} />}
      {loading && !results.videos.length && !results.channels.length && (
        <LoadingIndicator />
      )}

      <div className="space-y-8">
        {results.channels.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white mb-4">Channels</h2>
            {results.channels.map((channel) => (
              <ChannelCard key={channel._id} channel={channel} />
            ))}
          </div>
        )}

        {results.videos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-white mb-4">Videos</h2>
            <InfiniteScroll
              dataLength={results.videos.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<LoadingIndicator />}
              className="space-y-4"
              endMessage={
                <p className="text-center text-gray-400 mt-4">
                  No more results to show.
                </p>
              }
            >
              {results.videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </InfiniteScroll>
          </div>
        )}

        {!loading && !results.videos.length && !results.channels.length && (
          <div className="text-center text-gray-400 mt-8">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
