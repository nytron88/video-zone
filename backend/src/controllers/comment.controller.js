import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10, sortBy = "newest" } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  if (!["newest", "top"].includes(sortBy)) {
    throw new ApiError(400, "Invalid sort by value");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const pipeline = [
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likes" },
        isLiked: {
          $cond: {
            if: { $in: [req?.user._id, "$likes.likedBy"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        totalLikes: 1,
        isLiked: 1,
        owner: {
          username: 1,
          avatar: 1,
        },
      },
    },
    {
      $sort:
        sortBy === "top"
          ? { totalLikes: -1, createdAt: -1 }
          : { createdAt: -1 },
    },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      docs: "comments",
      totalDocs: "totalComments",
      totalPages: "totalPages",
      page: "currentPage",
    },
  };

  const result = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );

  let responseData = {
    comments: result.comments,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalComments: result.totalComments,
    },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Video comments fetched successfully")
    );
});

const getTweetComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { page = 1, limit = 10, sortBy = "newest" } = req.query;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  if (!["newest", "top"].includes(sortBy)) {
    throw new ApiError(400, "Invalid sort by value");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const pipeline = [
    {
      $match: {
        tweet: new mongoose.Types.ObjectId(tweetId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ["$owner", 0] },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "comment",
        as: "likes",
      },
    },
    {
      $addFields: {
        totalLikes: { $size: "$likes" },
      },
    },
    {
      $project: {
        content: 1,
        createdAt: 1,
        totalLikes: 1,
        owner: {
          username: 1,
          avatar: 1,
        },
      },
    },
    {
      $sort:
        sortBy === "top"
          ? { totalLikes: -1, createdAt: -1 }
          : { createdAt: -1 },
    },
  ];

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      docs: "comments",
      totalDocs: "totalComments",
      totalPages: "totalPages",
      page: "currentPage",
    },
  };

  const result = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );

  let responseData = {
    comments: result.comments,
    pagination: {
      currentPage: result.currentPage,
      totalPages: result.totalPages,
      totalComments: result.totalComments,
    },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Tweet comments fetched successfully")
    );
});

const addVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const comment = await Comment.create({
    content,
    owner: req.user._id,
    video: videoId,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const addTweetComment = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const comment = await Comment.create({
    content,
    owner: req.user._id,
    tweet: tweetId,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required");
  }

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req.user._id },
    { content },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const deletionConfirmation = await Comment.deleteOne({
    _id: commentId,
    owner: req.user._id, // Ensures only the owner can delete
  });

  if (deletionConfirmation.deletedCount === 0) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export {
  getVideoComments,
  getTweetComments,
  addVideoComment,
  addTweetComment,
  updateComment,
  deleteComment,
};
