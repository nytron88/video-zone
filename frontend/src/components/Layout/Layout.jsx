import React, { useState } from "react";
import { Sidebar } from "../index";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";

function Layout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      {isAuthenticated ? (
        <div className="flex pt-16">
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="Open Sidebar"
            className="md:hidden fixed left-4 bottom-4 z-50 bg-[#14181d] p-3 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          <main
            className={`flex-1 transition-all duration-300 ${
              isExpanded ? "md:ml-64" : "md:ml-16"
            }`}
          >
            <Outlet />
          </main>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default Layout;
