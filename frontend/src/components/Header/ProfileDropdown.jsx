import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ProfileDropdown({ avatar, fullName, username, onLogout }) {
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
              to={`/channel/${username}`}
              className="block px-4 py-2 text-sm text-blue-400 hover:bg-gray-700"
            >
              View your channel
            </Link>
            <Link
              to={`/dashboard`}
              className="block px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700"
            >
              Go to your dashboard
            </Link>
            <Link
              to={`/edit-profile`}
              className="block px-4 py-2 text-sm text-green-400 hover:bg-gray-700"
            >
              Edit your profile
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
