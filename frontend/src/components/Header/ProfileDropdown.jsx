import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ProfileDropdown({ avatar, fullName, username, onLogout, isLoading }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-700 animate-pulse">
        <span className="text-sm text-gray-400">...</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center focus:outline-none"
      >
        <img
          src={avatar}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-700"
        />
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="p-4 text-gray-300">
            <p className="font-semibold">{fullName}</p>
            <p className="text-sm text-gray-400">@{username}</p>
          </div>
          <div className="border-t border-gray-700">
            <Link
              to="/channel"
              className="block px-4 py-2 text-sm text-blue-400 hover:bg-gray-700"
            >
              View your channel
            </Link>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
