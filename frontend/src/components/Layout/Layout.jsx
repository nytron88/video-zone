import React, { useState } from "react";
import { Sidebar } from "../index";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      {isAuthenticated ? (
        <div className="flex pt-16">
          {" "}
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          <main
            className={`flex-1 transition-all duration-300 ${
              isExpanded ? "ml-64" : "ml-16"
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
