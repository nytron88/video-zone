import React, { useState, useEffect } from "react";
import { ToastContainer } from "../index";
import { toast } from "react-toastify";
import { updateVideo, getVideoById } from "../../store/slices/videoSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Input, Button, Loader } from "../index";
import { Upload, Video, Image as ImageIcon, Edit } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload";

function EditVideo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isDraggingThumbnail, setIsDraggingThumbnail] = useState(false);
  const { startUpload } = useCloudinaryUpload();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

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
    if (
      !data.videoFile &&
      !data.thumbnail &&
      !data.title &&
      !data.description
    ) {
      return toast.error("No changes detected.");
    }

    setIsLoading(true);

    try {
      let uploadedVideoResponse;
      if (data?.videoFile) {
        uploadedVideoResponse = await startUpload({
          file: data.videoFile,
          folder: "videos",
          resourceType: "video",
          metadata: {
            title: data.title,
            description: data.description,
            size: data.videoFile.size,
            type: data.videoFile.type,
          },
        });
      }

      let uploadedThumbnailResponse;

      if (data?.thumbnail) {
        uploadedThumbnailResponse = await startUpload({
          file: data.thumbnail,
          folder: "thumbnails",
          resourceType: "image",
          metadata: {
            title: data.title,
            description: data.description,
            size: data.thumbnail.size,
            type: data.thumbnail.type,
          },
        });
      }

      const submitData = {
        _id: videoId,
        title: data.title,
        description: data.description,
        uploadedVideoResponse,
        thumbnailLink: uploadedThumbnailResponse.secure_url,
      };

      const resultAction = await dispatch(updateVideo(submitData));
      if (updateVideo.fulfilled.match(resultAction)) {
        toast.success("Video published successfully!");
        return navigate(`/video/${resultAction.payload._id}`);
      } else {
        throw new Error("Failed to publish video");
      }
    } catch (err) {
      return toast.error(err.message || "Something went wrong during upload!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const video = await dispatch(getVideoById({ _id: videoId })).unwrap();

        // Set pre-filled form values
        setValue("title", video.title);
        setValue("description", video.description);
        setVideoPreview(video.videoFile);
        setThumbnailPreview(video.thumbnail);
      } catch (err) {
        toast.error("Failed to load video details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [dispatch, videoId, setValue]);

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-gradient-to-b from-[#1a1a1a] to-[#111111] rounded-xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center gap-3 mb-8">
          <Edit className="w-10 h-10 text-[#4169e1]" />
          <h1 className="text-2xl font-bold text-white text-center">
            Edit Video
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
            <Link to={`/video/${videoId}`}>
              <Button
                type="button"
                className="bg-[#2a2a2a] text-white hover:bg-[#333333] px-6 py-2.5 rounded-lg transition-colors font-medium"
                variant="outline"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#4169e1] text-white hover:bg-[#3154b3] px-6 py-2.5 rounded-lg transition-colors font-medium"
              variant="subtle"
            >
              Edit Video
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVideo;
