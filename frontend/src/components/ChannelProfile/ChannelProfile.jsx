import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserPlaylists } from "../../store/slices/playlistSlice";
import { getUserTweets } from "../../store/slices/tweetSlice";
import { getChannelVideos } from "../../store/slices/dashboardSlice";
import { getSubscribedChannels } from "../../store/slices/subscriptionSlice";
import { Link } from "react-router-dom";
import {
  AvatarBanner,
  CoverImageBanner,
  Loader,
  VideoGrid,
  ToastContainer,
} from "../index";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const ChannelProfile = ({
  channelDetails,
  fetchChannelProfile,
  toggleSubscription,
  isOwner = false,
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [subscribed, setSubscribed] = useState([]);

  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "playlist", label: "Playlist" },
    { id: "tweets", label: "Tweets" },
    { id: "subscriptions", label: "Subscriptions" },
  ];

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center w-full py-8">
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );

  const fetchTabContent = async (tabId) => {
    setLoading(true);
    try {
      switch (tabId) {
        case "playlist":
          if (playlists.length === 0) {
            const response = await dispatch(
              getUserPlaylists(channelDetails._id)
            ).unwrap();
            setPlaylists(response);
          }
          break;
        case "tweets":
          if (tweets.length === 0) {
            const response = await dispatch(
              getUserTweets(channelDetails._id)
            ).unwrap();
            setTweets(response);
          }
          break;
        case "subscriptions":
          if (subscribed.length === 0) {
            const response = await dispatch(
              getSubscribedChannels(channelDetails._id)
            ).unwrap();
            setSubscribed(response);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error("Error fetching content:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== "videos") {
      fetchTabContent(tabId);
    }
  };

  const handleSubscriptionToggle = async () => {
    try {
      await toggleSubscription();
    } catch (error) {
      toast.error("Error toggling subscription:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    setPlaylists([]);
    setTweets([]);
    setSubscribed([]);
    setActiveTab("videos");

    if (channelDetails) setLoading(false);
  }, [channelDetails]);

  if (!channelDetails) {
    return <Loader />;
  }

  const EmptyStateMessage = ({ message, submessage }) => (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <p className="text-lg text-gray-400">{message}</p>
      {submessage && <p className="text-sm text-gray-500 mt-2">{submessage}</p>}
    </div>
  );

  const renderPlaylists = () => (
    <div className="space-y-4">
      {isOwner && (
        <div className="flex justify-end mb-4">
          <Link
            to="/create-playlist"
            className="inline-flex items-center px-4 py-2 bg-violet-400 text-white text-sm font-medium rounded-full hover:bg-violet-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Playlist
          </Link>
        </div>
      )}
      {playlists.length === 0 ? (
        <EmptyStateMessage message="No playlists found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlist/${playlist._id}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors duration-300"
            >
              <div className="aspect-video relative bg-gray-900">
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <span className="text-white text-lg font-medium">
                    {playlist.videos.length} videos
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium truncate">
                  {playlist.name}
                </h3>
                {playlist.description && (
                  <p className="text-gray-400 text-sm truncate">
                    {playlist.description}
                  </p>
                )}
                <div className="text-sm text-gray-400 mt-1">
                  Updated {new Date(playlist.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      ;
    </div>
  );

  const renderTweets = () => (
    <div className="space-y-4">
      {isOwner && (
        <div className="flex justify-end mb-4">
          <Link
            to="/post-tweet"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Tweet
          </Link>
        </div>
      )}
      {tweets.length === 0 ? (
        <EmptyStateMessage message="No tweets found" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tweets.map((tweet) => (
            <Link
              className="bg-gray-800 p-4 rounded-lg"
              key={tweet._id}
              to={`/tweet/${tweet._id}`}
            >
              <p className="text-white text-base mb-2">{tweet.content}</p>
              <div className="flex justify-between text-sm text-gray-400">
                <span>{new Date(tweet.createdAt).toLocaleDateString()}</span>
                <div>
                  <span className="mr-4">{tweet.likes} likes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const renderSubscriptions = () =>
    subscribed.length === 0 ? (
      <EmptyStateMessage message="Not subscribed to anyone yet" />
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {subscribed.map((user) => (
          <Link
            key={user._id}
            to={`/channel/${user.username}`}
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <AvatarBanner avatarPreview={user.avatar} />
              <h3 className="text-white font-medium mt-2 truncate w-full">
                {user.fullname}
              </h3>
              <p className="text-gray-400 text-sm truncate w-full">
                @{user.username}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {user.subscribers?.toLocaleString() || 0} subscribers
              </p>
            </div>
          </Link>
        ))}
      </div>
    );

  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {(() => {
            switch (activeTab) {
              case "videos":
                return (
                  <VideoGrid
                    fetchAction={getChannelVideos}
                    limit={12}
                    userId={channelDetails._id}
                  />
                );
              case "playlist":
                return renderPlaylists();
              case "tweets":
                return renderTweets();
              case "subscriptions":
                return renderSubscriptions();
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <ToastContainer />
      <div className="w-full h-48 md:h-64 relative">
        <CoverImageBanner coverPreview={channelDetails.coverImage} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-12 sm:-mt-16 mb-8">
          <div className="flex flex-col items-center md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col items-center md:flex-row md:items-center">
              <div className="mb-4 md:mb-0 md:mr-4">
                <AvatarBanner avatarPreview={channelDetails.avatar} />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white sm:mt-8">
                  {channelDetails.fullname}
                </h1>
                <p className="text-gray-400 mt-1">@{channelDetails.username}</p>
                <div className="flex flex-wrap justify-center md:justify-start items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span className="flex items-center">
                    <span className="font-medium text-white mr-1">
                      {channelDetails.subscribersCount?.toLocaleString() || 0}
                    </span>
                    Subscribers
                  </span>
                  <span className="flex items-center">
                    <span className="font-medium text-white mr-1">
                      {channelDetails.channelsSubscribedToCount?.toLocaleString() ||
                        0}
                    </span>
                    Subscriptions
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {isOwner ? (
                <>
                  <Link
                    to="/edit-profile"
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Edit Channel
                  </Link>
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Manage Videos
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleSubscriptionToggle}
                  className={`w-full sm:w-auto px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    channelDetails.isSubscribed
                      ? "bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500"
                      : "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500"
                  }`}
                >
                  {channelDetails.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 border-b border-gray-800 overflow-x-auto">
          <nav className="flex space-x-4 md:space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative py-4 px-2 md:px-1 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="pb-12 px-4 sm:px-0">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;
