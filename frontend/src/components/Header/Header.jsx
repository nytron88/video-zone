import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import ProfileDropdown from "./ProfileDropdown";
import { Search, ArrowLeft, PlusCircle } from "lucide-react";
import SearchBar from "./SearchBar";

function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const userData = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSearchExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchExpanded]);

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result) => {
    setSearchQuery(result);
    setIsSearchExpanded(false);
  };

  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      console.log("Performing search for:", searchQuery);
      setIsSearchExpanded(false);
    }
  };

  if (loading) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-800 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 gap-2 md:gap-4">
          <Link to="/" className="flex items-center gap-1 md:gap-2 shrink-0">
            <img src={Logo} alt="logo" className="w-8 h-8 md:w-11 md:h-11" />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              VideoZone
            </span>
          </Link>

          <div className="hidden md:block w-[60%] mx-auto max-w-2xl">
            <SearchBar
              placeholder="Search for videos"
              value={searchQuery}
              onChange={handleSearchChange}
              onSearchIconClick={handleSearchIconClick}
              onResultClick={handleResultClick}
              isMobileSearch={false}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsSearchExpanded(true)}
              className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-colors"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {authStatus && (
              <Link
                to="/upload"
                className="flex items-center gap-1 md:gap-2 border border-violet-400 text-gray-300 px-2 py-1.5 md:px-4 md:py-2 rounded-md hover:border-violet-500 hover:text-white transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Create</span>
              </Link>
            )}

            {!authStatus ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base px-2.5 py-1.5 md:px-4 md:py-2 rounded-md border border-violet-400"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-violet-400 to-cyan-400 text-white text-sm md:text-base px-2.5 py-1.5 md:px-4 md:py-2 rounded-md font-medium hover:from-violet-500 hover:to-cyan-500 transition-all duration-200"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="ml-1">
                <ProfileDropdown
                  avatar={userData?.avatar}
                  fullName={userData?.fullname}
                  username={userData?.username}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        </div>
      </header>
      {isSearchExpanded && (
        <div className="fixed inset-0 z-50 bg-black md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-4 p-4 border-b border-gray-800">
              <button
                onClick={() => setIsSearchExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close Search"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex-1">
                <SearchBar
                  placeholder="Search for videos"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onSearchIconClick={handleSearchIconClick}
                  onResultClick={handleResultClick}
                  isMobileSearch={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
