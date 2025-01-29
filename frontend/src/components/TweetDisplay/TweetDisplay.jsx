import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTweetById, deleteTweet } from "../../store/slices/tweetSlice";
import {
  getTweetComments,
  addTweetComment,
} from "../../store/slices/commentSlice";
import { toggleTweetLike } from "../../store/slices/likeSlice";
import { CommentList, Error, Loader } from "../index";
import { UserCircle, Clock, ThumbsUp, Trash2, Edit } from "lucide-react";

function TweetDisplay() {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: userData } = useSelector((state) => state.user);

  const fetchTweet = async () => {
    try {
      const response = await dispatch(getTweetById(tweetId)).unwrap();
      setTweet(response);
    } catch (err) {
      console.error("Failed to fetch tweet:", err);
      setError("Unable to load tweet. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    try {
      await dispatch(toggleTweetLike(tweetId)).unwrap();
      fetchTweet();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleDeleteTweet = async () => {
    try {
      await dispatch(deleteTweet(tweetId)).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete tweet:", err);
    }
  };

  const handleEditTweet = () => {
    navigate(`/tweet/edit/${tweetId}`);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTweet();
  }, [tweetId]);

  if (isLoading) return <Loader />;

  if (!tweet || error) {
    return (
      <Error
        message={error || "Tweet not found."}
        details="Most likely the tweet doesn't exist"
      />
    );
  }

  const isOwnTweet = userData._id === tweet.owner._id;

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center p-4 space-x-4">
        <Link
          to={`/channel/${tweet.owner.username}`}
          className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
        >
          {tweet.owner.avatar ? (
            <img
              src={tweet.owner.avatar}
              alt={`${tweet.owner.fullname}'s avatar`}
              className="w-14 h-14 rounded-full border-2 border-blue-500 object-cover"
            />
          ) : (
            <UserCircle className="w-14 h-14 text-gray-500" />
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-white hover:text-blue-400">
                {tweet.owner.fullname}
              </h2>
            </div>
            <p className="text-sm text-gray-400">@{tweet.owner.username}</p>
          </div>
        </Link>
      </div>
      <div className="px-4 pb-4">
        <p className="text-white text-base mb-3">{tweet.content}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 space-x-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{new Date(tweet.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Like Button */}
            <button
              onClick={handleLikeToggle}
              className="flex items-center space-x-1 hover:text-red-500 transition-colors"
            >
              <ThumbsUp
                className={`w-5 h-5 ${
                  tweet.isLiked ? "text-red-500 fill-current" : "text-gray-500"
                }`}
              />
              <span>{tweet.likesCount || 0}</span>
            </button>

            {isOwnTweet && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleEditTweet}
                  className="text-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteTweet}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 p-4">
        <CommentList
          identifier={tweetId}
          getCommentsAction={getTweetComments}
          addCommentAction={addTweetComment}
        />
      </div>
    </div>
  );
}

export default TweetDisplay;
