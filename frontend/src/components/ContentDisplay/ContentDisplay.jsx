import React, { useState, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { throttle } from "lodash";
import LoadingSkeleton from "./LoadingSkeleton";

function ContentDisplay({
  fetchAction,
  renderItem,
  limit = 16,
  additionalParams = { sortBy: "createdAt", sortType: "desc" },
  itemName = "item",
}) {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seenIds] = useState(new Set());

  const handleItemLoad = useCallback((itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, loaded: true } : item
      )
    );
  }, []);

  const fetchItems = useCallback(
    throttle(async () => {
      if (loading || !hasMore) return;

      setLoading(true);
      try {
        const fetchedItemsData = await dispatch(
          fetchAction({
            page,
            limit,
            ...additionalParams,
          })
        ).unwrap();

        setItems((prevItems) => {
          const newUniqueItems = fetchedItemsData.videos
            .filter((item) => {
              if (seenIds.has(item._id)) {
                return false;
              }
              seenIds.add(item._id);
              return true;
            })
            .map((item) => ({
              ...item,
              loaded: false,
            }));

          if (newUniqueItems.length === 0) {
            setHasMore(false);
            return prevItems;
          }

          return [...prevItems, ...newUniqueItems];
        });

        if (
          !fetchedItemsData.hasNextPage ||
          fetchedItemsData.videos.length < limit
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
    }, 1000),
    [dispatch, page, hasMore, loading, seenIds, fetchAction, additionalParams]
  );

  useEffect(() => {
    fetchItems();
    return () => fetchItems.cancel();
  }, []);

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center w-full py-4 col-span-full">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          ></div>
        ))}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-6">
        <div className="text-red-500 text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          Error loading {itemName}s: {error}
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
          aria-label={`Loading ${itemName}s`}
        >
          {Array.from({ length: limit }).map((_, index) => (
            <LoadingSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={items.length}
          next={fetchItems}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
          endMessage={
            items.length > 0 ? (
              <p className="text-center text-gray-500 p-4" role="status">
                You've reached the end
              </p>
            ) : (
              <p
                className="text-center text-lg text-gray-400 p-4"
                role="status"
              >
                No {itemName}s found
              </p>
            )
          }
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            role="grid"
            aria-label={`${itemName} grid`}
          >
            {items.map((item) =>
              renderItem({ item, onItemLoad: handleItemLoad })
            )}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}

export default ContentDisplay;
