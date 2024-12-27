import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { WatchHistory } from "../models/watchHistory.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs/promises";
import { allowedImageMimeTypes, allowedVideoMimeTypes } from "../constants.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import upload from "../middlewares/multer.middleware.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoFile = req.files?.videoFile?.[0];
  const thumbnail = req.files?.thumbnail?.[0];

  if (!title || !description || !videoFile || !thumbnail) {
    if (videoFile) {
      await fs.unlink(videoFile.path);
    }

    if (thumbnail) {
      await fs.unlink(thumbnail.path);
    }
    throw new ApiError(400, "Please provide all required fields");
  }

  if (!allowedVideoMimeTypes.includes(videoFile.mimetype)) {
    await fs.unlink(videoFile.path);
    await fs.unlink(thumbnail.path);
    throw new ApiError(
      400,
      "Invalid video file type. Allowed types: MP4, AVI, MKV"
    );
  }

  if (!allowedImageMimeTypes.includes(thumbnail.mimetype)) {
    await fs.unlink(videoFile.path);
    await fs.unlink(thumbnail.path);
    throw new ApiError(
      400,
      "Invalid thumbnail file type. Allowed types: JPEG, PNG, WEBP"
    );
  }

  const videoFileLocalPath = videoFile.path;
  const thumbnailLocalPath = thumbnail.path;

  const uploadedVideoFile = await uploadOnCloudinary(videoFileLocalPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadedVideoFile || !uploadedThumbnail) {
    throw new ApiError(500, "Error uploading files");
  }

  const video = new Video({
    videoFile: uploadedVideoFile.url,
    thumbnail: uploadedThumbnail.url,
    title,
    description,
    duration: uploadedVideoFile.duration,
    owner: req.user._id,
  });

  await video.save();

  return res
    .status(201)
    .json(new ApiResponse(200, "Video published successfully", video));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const videoData = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              password: 0,
              email: 0,
              refreshToken: 0,
            },
          },
        ],
      },
    },
    {
      $unwind: "$owner",
    },
  ]);

  if (!videoData?.length) {
    throw new ApiError(404, "Video not found");
  }

  const video = await Video.findByIdAndUpdate(
    videoData[0]._id,
    { $inc: { views: 1 } },
    { new: true }
  );

  await WatchHistory.findOneAndUpdate(
    {
      user: req.user._id,
      video: video._id,
    },
    {},
    {
      upsert: true,
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video retrieved successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!title && !description && !req.file?.thumbnail) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const updates = {};

  if (title) updates.title = title;
  if (description) updates.description = description;

  if (req.file?.thumbnail) {
    if (!allowedImageMimeTypes.includes(req.file?.mimetype)) {
      throw new ApiError(
        400,
        "Invalid thumbnail file type. Allowed types: JPEG, PNG, WEBP"
      );
    }

    const thumbnailLocalPath = req.file?.path;

    const video = await Video.findById(videoId);

    await deleteFromCloudinary(video.thumbnail);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedThumbnail) {
      throw new ApiError(500, "Error uploading thumbnail");
    }

    updates.thumbnail = uploadedThumbnail.url;
  }

  const video = await Video.findByIdAndUpdate(videoId, updates, { new: true });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (req.user._id.toString() !== video.owner.toString()) {
    return next(
      new ApiError(
        401,
        "You do not have permission to perform this action on this resource"
      )
    );
  }

  const deletedVideo = await Video.findByIdAndDelete(videoId);

  await WatchHistory.deleteMany({ video: videoId });
  await Comment.deleteMany({ video: videoId });
  await Like.deleteMany({ video: videoId });
  await Playlist.updateMany(
    { videos: videoId },
    { $pull: { videos: videoId } }
  );
  await deleteFromCloudinary(deletedVideo.videoFile);
  await deleteFromCloudinary(deletedVideo.thumbnail);

  return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully", video));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
