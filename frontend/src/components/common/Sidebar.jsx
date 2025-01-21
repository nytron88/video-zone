import React, { useState, useEffect } from "react";
import {
  Video,
  Heart,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  History,
  ListVideo,
  Home,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ isExpanded, setIsExpanded, username }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: `/channel/${username}` },
    { icon: Heart, label: "Liked Videos", path: "/liked" },
    { icon: History, label: "Watch History", path: "/history" },
  ];

  return (
    <>
      {isExpanded && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black z-50 transition-all duration-300 
          ${
            isExpanded ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } 
          ${isExpanded ? "w-64" : "w-16"} 
          flex flex-col py-4`}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle Sidebar"
          className="hidden md:block absolute right-0 top-2 transform translate-x-1/2 bg-[#14181d] rounded-full p-1 hover:bg-gray-700 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>

        <nav className="flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsExpanded(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors ${
                  isExpanded ? "gap-3" : "justify-center"
                } ${isActive ? "bg-gray-700 text-gray-200" : ""}`
              }
            >
              <item.icon className="w-5 h-5" />
              {isExpanded && <span className="text-base">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
