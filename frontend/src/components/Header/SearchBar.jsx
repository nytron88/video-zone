import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  onSearchIconClick,
  placeholder,
  onResultClick,
  isMobileSearch,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value.trim().length > 0) {
        setResults([
          `${value} result 1`,
          `${value} result 2`,
          `${value} result 3`,
        ]);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [value]);

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

  const handleResultClick = (result) => {
    onResultClick(result);
    setIsOpen(false);
  };

  const ResultsList = () =>
    results.map((result, index) => (
      <div
        key={index}
        onClick={() => handleResultClick(result)}
        className="px-4 py-3 text-gray-300 hover:bg-gray-800 cursor-pointer flex items-center gap-3"
      >
        <Search className="w-4 h-4 text-gray-400" />
        {result}
      </div>
    ));

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={onChange}
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
    </div>
  );
};

export default SearchBar;
