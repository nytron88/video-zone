import React from "react";
import {
  Video,
  Heart,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  History,
  ListVideo,
  Home,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar({ isExpanded, setIsExpanded }) {
  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: UserCheck, label: "Subscriptions", path: "/subscriptions" },
    { icon: Heart, label: "Liked Videos", path: "/liked" },
    { icon: ListVideo, label: "Your Playlists", path: "/playlists" },
    { icon: History, label: "Watch History", path: "/history" },
    { icon: Video, label: "Your Videos", path: "/videos" },
  ];

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-black transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      } flex flex-col py-4`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-0 top-2 transform translate-x-1/2 bg-[#14181d] rounded-full p-1 hover:bg-gray-700 transition-colors"
      >
        {isExpanded ? (
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <nav className="flex-1">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-200 transition-colors ${
                isExpanded ? "gap-3" : "justify-center"
              } ${isActive ? "bg-gray-700 text-gray-200" : ""}`
            }
          >
            <item.icon className="w-5 h-5" />
            {isExpanded && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-4 py-2">
        {isExpanded && (
          <div className="text-xs text-gray-500">© 2025 VideoZone</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
