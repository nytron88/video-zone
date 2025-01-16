import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import { Search, ArrowLeft, PlusCircle } from "lucide-react";

function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
  };

  if (loading) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 gap-4">
        {!isSearchExpanded && (
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="logo" className="w-11 h-11" />
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              VideoZone
            </span>
          </Link>
        )}
        <div className={`flex-1 ${isSearchExpanded ? "md:flex-none" : ""}`}>
          {isSearchExpanded ? (
            <div className="flex items-center w-full">
              <button
                onClick={() => setIsSearchExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close Search"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <SearchBar
                placeholder="Search for videos"
                className="ml-2 flex-1"
              />
            </div>
          ) : (
            <div className="hidden md:block w-[60%] mx-auto">
              <SearchBar placeholder="Search for videos" />
            </div>
          )}
        </div>
        {!isSearchExpanded && (
          <button
            onClick={() => setIsSearchExpanded(true)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Open Search"
          >
            <Search className="w-6 h-6" />
          </button>
        )}
        <div
          className={`flex items-center gap-4 ${
            isSearchExpanded ? "hidden" : ""
          }`}
        >
          {authStatus && (
            <Link
              to="/upload"
              className="flex items-center gap-2 border border-violet-400 text-gray-300 px-3 py-[0.6rem] md:px-4 md:py-2 rounded-md hover:border-violet-500 hover:text-white transition-all duration-200"
            >
              <PlusCircle className="w-[1.15rem] h-[1.15rem] md:w-5 md:h-5" />
              <span className="text-[0.9rem] md:text-base">Create</span>
            </Link>
          )}

          {!authStatus ? (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-[0.9rem] md:text-base px-3 py-[0.6rem] md:px-4 md:py-2 rounded-md border border-violet-400"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-violet-400 to-cyan-400 text-white text-[0.9rem] md:text-base px-3 py-[0.6rem] md:px-4 md:py-2 rounded-md font-medium hover:from-violet-500 hover:to-cyan-500 transition-all duration-200"
              >
                Sign up
              </Link>
            </>
          ) : (
            <ProfileDropdown
              avatar={userData?.avatar}
              fullName={userData?.fullname}
              username={userData?.username}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
