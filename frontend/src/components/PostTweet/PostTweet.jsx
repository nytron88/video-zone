import React from "react";
import { useForm } from "react-hook-form";
import { MessageCircle } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "../index";
import { createTweet } from "../../store/slices/tweetSlice";
import { useNavigate } from "react-router-dom";

function PostTweet() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const { data: userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const content = watch("content", "");
  const characterCount = content.length;
  const maxCharacters = 500;

  const onSubmit = async (data) => {
    try {
      await dispatch(createTweet(data)).unwrap();
      navigate(`/channel/${userData?.username}`);
      reset();
      toast.success("Your tweet has been posted!");
    } catch (error) {
      toast.error("Failed to post your tweet. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-6">
      {/* Toast Container */}
      <ToastContainer /> {/* Using your pre-configured ToastContainer */}
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Post a Tweet
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 space-y-6"
        >
          <div className="flex items-start space-x-4">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <img
                src={userData?.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="h-14 w-14 rounded-full border-2 border-gray-800"
              />
            </div>

            {/* Tweet Content */}
            <div className="flex-grow">
              <textarea
                {...register("content", {
                  required: "Tweet content is required",
                  maxLength: {
                    value: maxCharacters,
                    message: `Tweet cannot exceed ${maxCharacters} characters`,
                  },
                })}
                placeholder="What's happening?"
                className="w-full bg-transparent text-gray-200 text-lg placeholder-gray-500 border-none focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none min-h-[120px] max-h-[240px] overflow-hidden"
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-center border-t border-gray-800 pt-4">
            {/* Character Counter */}
            <div
              className={`text-sm ${
                characterCount > maxCharacters
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {characterCount}/{maxCharacters}
            </div>

            {/* Tweet Button */}
            <button
              type="submit"
              disabled={characterCount === 0 || characterCount > maxCharacters}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            >
              <MessageCircle size={18} />
              <span>Tweet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostTweet;
