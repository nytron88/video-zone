import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, VideoDisplay } from "../components";

function Home() {
  const { data } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? (
    <VideoDisplay />
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6">
      <div className="w-full max-w-2xl mx-auto text-center space-y-6">
        <div className="bg-gray-900/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-800">
          <h1 className="text-4xl font-bold text-white mb-4">
            Try searching to get started
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Start watching videos to help us build a feed of videos you'll love.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                className="w-full sm:w-auto px-8 py-3 text-white rounded-lg font-medium transition-colors duration-200"
                variant="outline"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="w-full sm:w-auto px-8 py-3 bg-transparen border border-blue-500 rounded-lg font-medium hover:bg-blue-500/10 transition-colors duration-200">
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
