import React from "react";
import { XCircle } from "lucide-react";

function Error({ message, className = "" }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background with gradient glow */}
      <div className="absolute inset-0 blur-xl opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-violet-500/20 animate-pulse"></div>
      </div>
      
      {/* Main content */}
      <div className="relative p-4 rounded-lg border border-red-500/20 bg-black/40 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          
          <div className="space-y-1">
            <h3 className="font-semibold bg-gradient-to-r from-red-400 to-violet-400 bg-clip-text text-transparent">
              Error Occurred
            </h3>
            
            <p className="text-gray-400 text-sm">
              {message || "Something went wrong. Please try again."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;