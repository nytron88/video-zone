import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { getAllVideos } from "../../store/slices/videoSlice";

function VideoDisplay() {
  const dispatch = useDispatch();
  const { searchData: videos } = useSelector((state) => state.video);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(getDynamicLimit());

  const fetchVideos = () => {
    dispatch(getAllVideos({ page, limit, sortBy: "views", sortType: "desc" }))
      .unwrap()
      .then((fetchedVideos) => {
        if (fetchedVideos.length < limit) {
          setHasMore(false);
        }
        setPage(page + 1);
      });
  };

  function getDynamicLimit() {
    const width = window.innerWidth;
    if (width >= 1200) return 6; // Large screens
    if (width >= 768) return 10; // Medium screens
    return 5; // Small screens
  }

  useEffect(() => {
    const handleResize = () => {
      setLimit(getDynamicLimit());
    };

    window.addEventListener("resize", handleResize);
    fetchVideos();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-black text-white p-5">
      <h1 className="text-3xl font-bold mb-5">Home</h1>
      <InfiniteScroll
        dataLength={videos?.length || 0}
        next={fetchVideos}
        hasMore={hasMore}
        loader={<p className="text-center">Loading...</p>}
        endMessage={<p className="text-center">No more videos to load</p>}
        style={{ overflow: "hidden" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {videos?.map((video, index) => (
            <div
              key={index}
              className="bg-gray-800 p-3 rounded-lg hover:shadow-lg transition-shadow"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold mb-2 truncate">
                {video.title}
              </h3>
              <p className="text-sm text-gray-400 mb-1">
                {video.views} Views &bull; {video.uploadedAt}
              </p>
              <p className="text-sm text-gray-300">{video.creator}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default VideoDisplay;
