import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const like = await Like.findOne({
    likedBy: req.user.id,
    video: videoId,
  });

  let message;

  if (like) {
    await Like.deleteOne({ _id: like._id });
    message = "Video unliked successfully";
  } else {
    await Like.create({
      likedBy: req.user.id,
      video: videoId,
    });
    message = "Video liked successfully";
  }

  return res.status(200).json(new ApiResponse(200, {}, message));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const like = await Like.findOne({
    likedBy: req.user.id,
    comment: commentId,
  });

  let message;

  if (like) {
    await Like.deleteOne({ _id: like._id });
    message = "Comment unliked successfully";
  } else {
    await Like.create({
      likedBy: req.user.id,
      comment: commentId,
    });
    message = "Comment liked successfully";
  }

  return res.status(200).json(new ApiResponse(200, {}, message));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const like = await Like.findOne({
    likedBy: req.user.id,
    tweet: tweetId,
  });

  let message;

  if (like) {
    await Like.deleteOne({ _id: like._id });
    message = "Tweet unliked successfully";
  } else {
    await Like.create({
      likedBy: req.user.id,
      tweet: tweetId,
    });
    message = "Tweet liked successfully";
  }

  return res.status(200).json(new ApiResponse(200, {}, message));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const aggregateQuery = [
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user.id),
        video: { $exists: true },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $match: {
              isPublished: true,
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
                    _id: 1,
                    username: 1,
                    fullname: 1,
                    avatar: 1,
                    coverImage: 1,
                    createdAt: 1,
                    updatedAt: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$owner",
          },
        ],
      },
    },
    {
      $unwind: "$video",
    },
    {
      $replaceRoot: { newRoot: "$video" },
    },
  ];

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const result = await Like.aggregatePaginate(
    Like.aggregate(aggregateQuery),
    options
  );

  const responseData = {
    videos: result.docs,
    totalVideos: result.totalDocs,
    limit: result.limit,
    currentPage: result.page,
    totalPages: result.totalPages,
    pagingCounter: result.pagingCounter,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Liked videos fetched successfully")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
