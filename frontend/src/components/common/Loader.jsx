import React from "react";

function Loader({ className = "" }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 blur-xl">
          <div className="absolute top-0 left-0 w-full h-full bg-violet-500/20 rounded-full animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/20 rounded-full animate-pulse delay-300"></div>
        </div>
        <div className="h-16 w-16 rounded-full border-4 border-t-violet-400 border-r-cyan-400 border-b-violet-400 border-l-cyan-400 animate-spin" />
      </div>
    </div>
  );
}

Loader.Spinner = ({ className = "" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 blur-md">
          <div className="w-full h-full bg-violet-500/20 rounded-full animate-pulse"></div>
        </div>
        <div
          className={`w-8 h-8 rounded-full border-2 border-t-violet-400 border-r-transparent border-b-cyan-400 border-l-transparent animate-spin ${className}`}
        />
      </div>
    </div>
  );
};

Loader.Pulse = ({ className = "" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 blur-xl">
          <div className="w-full h-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full animate-pulse"></div>
        </div>
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
    </div>
  );
};

Loader.Ring = ({ className = "" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 blur-xl">
          <div className="w-full h-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full animate-pulse"></div>
        </div>
        <div className={`relative ${className}`}>
          <div className="absolute inset-0 rounded-full border-4 border-violet-400/20 animate-ping"></div>
          <div className="w-12 h-12 rounded-full border-4 border-t-violet-400 border-r-cyan-400/50 border-b-cyan-400 border-l-violet-400/50 animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
