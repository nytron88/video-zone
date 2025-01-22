import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "../index";
import { toast } from "react-toastify";
import { createPlaylist } from "../../store/slices/playlistSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function CreatePlaylist() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: userData } = useSelector((state) => state.user);

  const name = watch("name", "");
  const description = watch("description", "");
  const maxNameLength = 50;
  const maxDescriptionLength = 300;

  const onSubmit = async (data) => {
    try {
      await dispatch(createPlaylist(data)).unwrap();
      navigate(`/channel/${userData?.username}`);
      reset();
      toast.success("Playlist created successfully!");
    } catch (error) {
      toast.error("Failed to create playlist. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-6">
      <ToastContainer />

      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">
          Create a Playlist
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 space-y-6"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 font-medium mb-2"
            >
              Playlist Name
            </label>
            <input
              {...register("name", {
                required: "Name is required",
                maxLength: {
                  value: maxNameLength,
                  message: `Name cannot exceed ${maxNameLength} characters`,
                },
              })}
              id="Name"
              type="text"
              placeholder="Enter playlist name"
              className={`w-full bg-gray-900 text-gray-200 text-lg placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 font-medium mb-2"
            >
              Playlist Description
            </label>
            <textarea
              {...register("description", {
                maxLength: {
                  value: maxDescriptionLength,
                  message: `Description cannot exceed ${maxDescriptionLength} characters`,
                },
              })}
              id="description"
              placeholder="Enter playlist description (optional)"
              className={`w-full bg-gray-900 text-gray-200 text-lg placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none min-h-[120px] ${
                errors.description ? "border-red-500" : ""
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              disabled={name.length === 0}
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePlaylist;
