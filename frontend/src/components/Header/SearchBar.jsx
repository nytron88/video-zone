import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { searchVideosAndChannels } from "../../store/slices/videoSlice";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({
  value,
  onChange,
  onSearchIconClick,
  placeholder,
  isMobileSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeSearch = () => {
    setIsOpen(false);
    setResults([]);
    if (isMobileSearch && onSearchIconClick) {
      onSearchIconClick();
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (value.trim().length > 0) {
        try {
          setLoading(true);
          const response = await dispatch(
            searchVideosAndChannels({
              query: value,
              type: "all",
              limit: 10,
              sortBy: "score",
              page: 1,
            })
          ).unwrap();

          const combinedResults = [
            ...(response?.videos || []).map((video) => ({
              type: "video",
              id: video._id,
              label: video.title,
            })),
            ...(response?.channels || []).map((channel) => ({
              type: "channel",
              id: channel._id,
              label: channel.username,
            })),
          ];

          const uniqueResults = Array.from(
            new Map(combinedResults.map((item) => [item.label, item])).values()
          );

          setResults(uniqueResults);
          setIsOpen(true);
        } catch (error) {
          setResults([]);
          setIsOpen(false);
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, dispatch]);

  useEffect(() => {
    if (!isMobileSearch) {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileSearch]);

  const handleResultClick = (query) => {
    closeSearch();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter" && value.trim().length > 0) {
      closeSearch();
      navigate(`/search?query=${encodeURIComponent(value.trim())}`);
    }
  };

  useEffect(() => {
    return () => {
      closeSearch();
    };
  }, [navigate]);

  const ResultsList = () => (
    <>
      {results.map((result, index) => (
        <div
          key={index}
          onClick={() => handleResultClick(result.label)}
          className="px-4 py-3 text-gray-300 hover:bg-gray-800 cursor-pointer flex items-center gap-3 transition-colors"
        >
          <Search className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{result.label}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleEnterKey}
          placeholder={placeholder || "Search"}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          autoFocus={isMobileSearch}
        />
        <button
          onClick={onSearchIconClick}
          className="absolute left-2 p-1 rounded-full hover:bg-gray-700/50 transition-colors group"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors" />
        </button>
      </div>

      {!isMobileSearch && isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-gray-800 border border-gray-700 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
          <ResultsList />
        </div>
      )}

      {isMobileSearch && isOpen && results.length > 0 && (
        <div className="fixed left-0 right-0 bg-black border-t border-gray-800 mt-4">
          <ResultsList />
        </div>
      )}

      {loading && (
        <div className="absolute top-full left-0 right-0 z-50 bg-gray-800 border border-gray-700 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto flex items-center justify-center py-2 text-gray-400">
          Loading...
        </div>
      )}
    </div>
  );
};

export default SearchBar;
