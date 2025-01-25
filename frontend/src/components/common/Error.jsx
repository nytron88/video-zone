import React from "react";
import { XCircle, Home, RefreshCw } from "lucide-react";

function Error({
  message = "Something went wrong. Please try again.",
  className = "",
  showHomeButton = true,
  showRetryButton = false,
  onHomeClick = () => (window.location.href = "/"),
  onRetryClick,
  title = "Error Occurred",
  details = null,
}) {
  return (
    <div className={`flex justify-center items-center py-16 px-4 ${className}`}>
      <div className="relative w-full max-w-2xl p-8 rounded-lg border border-red-500/30 bg-black/70 text-gray-300 shadow-xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-violet-500/20 opacity-20 blur-lg animate-pulse"></div>

        {/* Error Content */}
        <div className="relative space-y-6">
          {/* Title and Icon */}
          <div className="flex items-center gap-4">
            <XCircle className="w-8 h-8 text-red-500 shrink-0" />
            <h1 className="text-2xl font-extrabold text-red-400 bg-gradient-to-r from-red-400 to-violet-400 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>

          {/* Message */}
          <p className="text-lg font-semibold">{message}</p>

          {/* Details */}
          {details && (
            <div className="p-4 bg-gray-800/70 rounded-md border border-red-600/30">
              <pre className="text-sm text-red-200 overflow-x-auto">
                {details}
              </pre>
            </div>
          )}

          {/* Buttons */}
          {(showHomeButton || showRetryButton) && (
            <div className="flex justify-end gap-4 border-t border-red-500/20 pt-4">
              {showHomeButton && (
                <button
                  onClick={onHomeClick}
                  className="px-6 py-2 text-sm font-bold text-gray-300 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </button>
              )}
              {showRetryButton && (
                <button
                  onClick={onRetryClick}
                  disabled={!onRetryClick}
                  className="px-6 py-2 text-sm font-bold text-white bg-red-600 border border-red-500 rounded hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Error;
