import React, { useState } from "react";
import { ToastContainer } from "../index";
import { toast } from "react-toastify";
import { publishAVideo } from "../../store/slices/videoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Input, Button, Loader } from "../index";
import { Upload, Video, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function VideoUpload() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.video);
  const navigate = useNavigate();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      videoFile: null,
      thumbnail: null,
    },
  });

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video size should be less than 100MB");
        return;
      }
      setVideoPreview(URL.createObjectURL(file));
      setValue("videoFile", file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", file);
    }
  };

  const handleDragOver = (e, setDragging) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e, setDragging) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e, type, setDragging) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (type === "video") {
      handleVideoChange({ target: { files: [file] } });
    } else {
      handleThumbnailChange({ target: { files: [file] } });
    }
  };

  const submit = async (data) => {
    if (!data.videoFile || !data.thumbnail) {
      toast.error("Please upload both video and thumbnail");
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", data.videoFile);
    formData.append("thumbnail", data.thumbnail);
    formData.append("title", data.title);
    formData.append("description", data.description);

    try {
      const resultAction = await dispatch(publishAVideo(formData));
      if (publishAVideo.fulfilled.match(resultAction)) {
        toast.success("Video uploaded successfully!");
        setVideoPreview(null);
        setThumbnailPreview(null);
        setValue("title", "");
        setValue("description", "");
        setValue("videoFile", null);
        setValue("thumbnail", null);
        navigate(`/video/${resultAction.payload._id}`);
      }
    } catch (err) {
      toast.error(error?.message || "Something went wrong!");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-gradient-to-b from-[#1a1a1a] to-[#111111] rounded-xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3 mb-8">
          <Upload className="w-10 h-10 text-[#4169e1]" />
          <h1 className="text-2xl font-bold text-white text-center">
            Upload Video
          </h1>
        </div>

        <ToastContainer />

        <form onSubmit={handleSubmit(submit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-white text-xl font-medium mb-2">
                Video File
              </label>
              <div
                className={`relative border-2 ${
                  isDraggingVideo
                    ? "border-[#4169e1]"
                    : "border-dashed border-[#2a2a2a]"
                } rounded-xl p-4 text-center transition-all duration-200 hover:border-[#4169e1] bg-[#141414]`}
                onDragOver={(e) => handleDragOver(e, setIsDraggingVideo)}
                onDragLeave={(e) => handleDragLeave(e, setIsDraggingVideo)}
                onDrop={(e) => handleDrop(e, "video", setIsDraggingVideo)}
              >
                {videoPreview ? (
                  <div className="relative group">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setValue("videoFile", null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer block p-6"
                  >
                    <Video className="w-12 h-12 mx-auto mb-4 text-[#4169e1]" />
                    <div className="text-gray-400">
                      <p className="font-medium mb-1">
                        Drag and drop your video
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to browse
                      </p>
                      <p className="mt-2 text-xs text-[#4169e1]">
                        Maximum file size: 100MB
                      </p>
                    </div>
                  </label>
                )}
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </div>
              {errors.videoFile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.videoFile.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-white text-xl font-medium mb-2">
                Thumbnail Image
              </label>
              <div
                className={`relative border-2 ${
                  isDraggingThumbnail
                    ? "border-[#4169e1]"
                    : "border-dashed border-[#2a2a2a]"
                } rounded-xl p-4 text-center transition-all duration-200 hover:border-[#4169e1] bg-[#141414]`}
                onDragOver={(e) => handleDragOver(e, setIsDraggingThumbnail)}
                onDragLeave={(e) => handleDragLeave(e, setIsDraggingThumbnail)}
                onDrop={(e) =>
                  handleDrop(e, "thumbnail", setIsDraggingThumbnail)
                }
              >
                {thumbnailPreview ? (
                  <div className="relative group">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview(null);
                        setValue("thumbnail", null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer block p-6"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-[#4169e1]" />
                    <div className="text-gray-400">
                      <p className="font-medium mb-1">Upload thumbnail image</p>
                      <p className="text-sm text-gray-500">or drag and drop</p>
                      <p className="mt-2 text-xs text-[#4169e1]">
                        Recommended: 16:9 ratio
                      </p>
                    </div>
                  </label>
                )}
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleThumbnailChange}
                />
              </div>
              {errors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-white text-xl font-medium mb-2">
              Title
            </label>
            <Input
              id="title"
              {...register("title", {
                required: "Title is required",
              })}
              className="w-full bg-[#141414] text-white border border-[#2a2a2a] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4169e1] transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-white text-xl font-medium mb-2">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full bg-[#141414] text-white border border-[#2a2a2a] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4169e1] transition-all h-32 resize-none"
              placeholder="Tell viewers about your video..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={() => {
                setVideoPreview(null);
                setThumbnailPreview(null);
                setValue("title", "");
                setValue("description", "");
                setValue("videoFile", null);
                setValue("thumbnail", null);
              }}
              className="bg-[#2a2a2a] text-white hover:bg-[#333333] px-6 py-2.5 rounded-lg transition-colors font-medium"
              variant="outline"
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="bg-[#4169e1] text-white hover:bg-[#3154b3] px-6 py-2.5 rounded-lg transition-colors font-medium"
              variant="subtle"
            >
              Upload Video
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;
