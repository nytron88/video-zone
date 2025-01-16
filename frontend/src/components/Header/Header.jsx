import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";

function Header() {
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
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="logo" className="w-11 h-11" />
          <span className="hidden md:block text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            VideoZone
          </span>
        </Link>

        {/* Search Component */}
        <SearchBar placeholder="Search for videos" />

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!authStatus ? (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base px-2 py-1 md:px-4 md:py-2 rounded-lg"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-violet-400 to-cyan-400 text-white text-sm md:text-base px-3 py-1 md:px-4 md:py-2 rounded-lg font-medium hover:from-violet-500 hover:to-cyan-500 transition-all duration-200"
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
