import React, { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserChannelProfile } from "../../store/slices/userSlice";
import { toggleSubscription } from "../../store/slices/subscriptionSlice";
import { toggleVideoLike } from "../../store/slices/likeSlice";
import {
  addVideoToPlaylist,
  getUserPlaylists,
} from "../../store/slices/playlistSlice";
import { ThumbsUp, Share2, Copy, List } from "lucide-react";
import { toast } from "react-toastify";
import { ToastContainer } from "../index";

function PlaylistModal({ videoId, onClose }) {
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state) => state.user);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await dispatch(
          getUserPlaylists(userData.username)
        ).unwrap();
        setPlaylists(response);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch playlists");
        console.error("Playlist fetch error:", error);
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [dispatch, userData.username]);

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await dispatch(
        addVideoToPlaylist({
          videoId,
          playlistId,
        })
      ).unwrap();
      toast.success("Video added to playlist");
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to add video to playlist");
      console.error("Add to playlist error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="animate-pulse bg-gray-800 rounded-xl p-6 w-96">
          Loading playlists...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-gray-700 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Add to Playlist</h2>
        {playlists.length === 0 ? (
          <p className="text-gray-400 text-center">No playlists found</p>
        ) : (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist._id}
                onClick={() => handleAddToPlaylist(playlist._id)}
                className="w-full text-left px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                {playlist.name}
              </button>
            ))}
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export { PlaylistModal };

function VideoDetails({ video }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: userData } = useSelector((state) => state.user);
  const [channelOwner, setChannelOwner] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  function VideoShareModal({ videoUrl, onClose }) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
      navigator.clipboard
        .writeText(videoUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          toast.error("Failed to copy link");
          console.error("Copy failed", err);
        });
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-2xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Share Video</h2>
          <div className="flex items-center bg-gray-700 rounded-lg p-3">
            <input
              type="text"
              value={videoUrl}
              readOnly
              className="flex-grow bg-transparent text-white outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="ml-2 text-purple-400 hover:text-purple-300"
            >
              {copied ? <Copy className="text-green-500" /> : <Copy />}
            </button>
          </div>
          {copied && (
            <p className="text-green-500 text-sm mt-2 text-center">
              Link copied to clipboard!
            </p>
          )}
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchChannelOwner = async () => {
      try {
        const response = await dispatch(
          getUserChannelProfile(video?.owner.username)
        ).unwrap();
        setIsLiked(video.isLiked);
        setTotalLikes(video.likes);
        setChannelOwner(response);
        setIsSubscribed(response.isSubscribed);
        setSubscribersCount(response.subscribersCount || 0);
      } catch (error) {
        console.error("Failed to fetch channel owner:", error);
      }
    };

    fetchChannelOwner();
  }, [dispatch, video?.owner]);

  const handleToggleLike = async () => {
    try {
      await dispatch(toggleVideoLike(video._id)).unwrap();
      setIsLiked(!isLiked);
      setTotalLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    } catch (error) {
      toast.error("Failed to toggle like");
      console.error("Like toggle error:", error);
    }
  };

  const handleSubscribe = async () => {
    try {
      const result = await dispatch(
        toggleSubscription(video.owner._id)
      ).unwrap();
      setIsSubscribed(!isSubscribed);
      setSubscribersCount(result.subscribersCount);
      toast.success(
        isSubscribed ? "Unsubscribed from channel" : "Subscribed to channel"
      );
    } catch (error) {
      toast.error("Failed to update subscription");
      console.error("Subscription error:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/video/edit/${video._id}`);
  };

  const formatSubscriberCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!channelOwner) {
    return <div className="animate-pulse bg-gray-700 h-48 rounded-xl"></div>;
  }

  return (
    <div className="bg-black border border-gray-700/50 rounded-xl p-4 shadow-lg mb-6">
      <ToastContainer />
      {showShareModal && (
        <VideoShareModal
          videoUrl={window.location.href}
          onClose={() => setShowShareModal(false)}
        />
      )}
      {showPlaylistModal && (
        <PlaylistModal
          videoId={video._id}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}

      <h1 className="text-2xl font-bold text-white mb-4">{video.title}</h1>
      <div className="flex items-center justify-between mb-6">
        <Link
          to={`/channel/${channelOwner.username}`}
          className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
        >
          <img
            src={channelOwner.avatar || "/placeholder.svg"}
            alt={channelOwner.fullname}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-white">{channelOwner.fullname}</p>
            <p className="text-sm text-gray-400">
              @{channelOwner.username} •{" "}
              {formatSubscriberCount(subscribersCount)} subscribers
            </p>
          </div>
        </Link>
        <button
          onClick={
            userData.username === video.owner.username
              ? handleEdit
              : handleSubscribe
          }
          className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
            userData.username === video.owner.username
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : isSubscribed
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {userData.username === video.owner.username ? (
            "Edit Video"
          ) : isSubscribed ? (
            <>
              <span>Subscribed</span>
            </>
          ) : (
            <>
              <span>Subscribe</span>
            </>
          )}
        </button>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={handleToggleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isLiked
              ? "bg-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          } transition-colors`}
        >
          <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
          <span>{totalLikes}</span>
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
        <button
          onClick={() => setShowPlaylistModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <List className="w-5 h-5" />
          <span>Add to Playlist</span>
        </button>
      </div>
      <div className="bg-gray-900 rounded-lg p-4">
        <p className="text-white mb-2">
          {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-300">{video.description}</p>
      </div>
    </div>
  );
}

export default memo(VideoDetails);
