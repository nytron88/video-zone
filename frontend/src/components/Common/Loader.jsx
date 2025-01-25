import React from "react";

function Loader({ className = "" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className={`relative ${className}`}>
        <div className="h-16 w-16 rounded-full border-4 border-t-violet-400 border-r-cyan-400 border-b-violet-400 border-l-cyan-400 animate-spin" />
      </div>
    </div>
  );
}

Loader.Spinner = ({ className = "" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative">
        <div
          className={`w-8 h-8 rounded-full border-2 border-t-violet-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin ${className}`}
        />
      </div>
    </div>
  );
};

Loader.Pulse = ({ className = "" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex gap-2">
        <div
          className={`w-4 h-4 rounded-full bg-gradient-to-r from-violet-400 to-violet-500 animate-pulse ${className}`}
        />
        <div
          className={`w-4 h-4 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 animate-pulse delay-150 ${className}`}
        />
        <div
          className={`w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 animate-pulse delay-300 ${className}`}
        />
      </div>
    </div>
  );
};

Loader.Ring = ({ className = "" }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative">
        <div className={`relative ${className}`}>
          <div className="absolute inset-0 rounded-full border-4 border-violet-400/20 animate-ping"></div>
          <div className="w-12 h-12 rounded-full border-4 border-t-violet-400 border-r-cyan-400/50 border-b-cyan-400 border-l-violet-400/50 animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
