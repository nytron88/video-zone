import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVideoComments,
  addVideoComment,
  updateComment,
  deleteComment,
} from "../../store/slices/commentSlice";
import { toggleCommentLike } from "../../store/slices/likeSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { Edit2, Trash2, RefreshCcw, Check, X, ThumbsUp } from "lucide-react";
import { toast } from "react-toastify";
import { ToastContainer } from "../index";

function CommentList({ videoId }) {
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [sortBy, setSortBy] = useState("top");
  const totalCommentsRef = useRef(0);
  const seenCommentIds = useMemo(() => new Set(), [videoId]);
  const LIMIT = 10;

  const fetchComments = useCallback(
    async (pageNum, isRefresh = false) => {
      try {
        const response = await dispatch(
          getVideoComments({ videoId, page: pageNum, limit: LIMIT, sortBy })
        ).unwrap();

        setComments((prevComments) => {
          if (isRefresh) {
            seenCommentIds.clear();
            response.comments.forEach((comment) =>
              seenCommentIds.add(comment._id)
            );
            return response.comments;
          }
          const newUniqueComments = response.comments.filter((comment) => {
            if (seenCommentIds.has(comment._id)) return false;
            seenCommentIds.add(comment._id);
            return true;
          });
          return [...prevComments, ...newUniqueComments];
        });
        totalCommentsRef.current = response.pagination.totalComments;
        if (response.comments.length < LIMIT) {
          setHasMore(false);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch comments");
        setHasMore(false);
      } finally {
        setIsLoading(false);
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [dispatch, videoId, seenCommentIds, sortBy]
  );

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    seenCommentIds.clear();
    fetchComments(1);
  }, [fetchComments, videoId]);

  useEffect(() => {
    if (!isLoading) {
      handleRefresh();
    }
  }, [sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    await fetchComments(1, true);
  };

  const handleLoadMore = async () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchComments(nextPage);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await dispatch(
        addVideoComment({ videoId, content: newComment })
      ).unwrap();
      setNewComment("");
      toast.success("Comment added successfully");
      handleRefresh();
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent?.trim()) return;
    try {
      await dispatch(
        updateComment({ commentId, content: editContent })
      ).unwrap();
      toast.success("Comment updated successfully");
      handleCancelEdit();
      handleRefresh();
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteCommentId) {
      try {
        await dispatch(deleteComment(deleteCommentId)).unwrap();
        toast.success("Comment deleted successfully");
        handleRefresh();
      } catch (error) {
        toast.error("Failed to delete comment");
      } finally {
        setDeleteCommentId(null);
      }
    }
  };

  const handleToggleLike = async (commentId) => {
    try {
      await dispatch(toggleCommentLike(commentId)).unwrap();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                totalLikes: comment.isLiked
                  ? comment.totalLikes - 1
                  : comment.totalLikes + 1,
              }
            : comment
        )
      );
    } catch (error) {
      toast.error("Failed to toggle like");
    }
  };

  const CommentSkeleton = () => (
    <div className="flex items-start gap-4 p-4 border-b border-gray-700/50 animate-pulse">
      <div className="w-10 h-10 bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-700 rounded w-3/4" />
      </div>
    </div>
  );

  const DeleteConfirmDialog = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        deleteCommentId ? "" : "hidden"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-4">
          Delete Comment
        </h3>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteCommentId(null)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const LoadingIndicator = () => (
    <div className="flex justify-center items-center w-full py-6">
      <div className="flex space-x-3">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );

  const CommentContent = ({
    comment,
    onUpdateComment,
    onCancelEdit,
    onDelete,
    onToggleLike,
  }) => {
    const textareaRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);

    const handleEditClick = () => {
      setIsEditing(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
    };

    const handleSaveClick = () => {
      if (content.trim()) {
        onUpdateComment(comment._id, content);
        setIsEditing(false);
      }
    };

    const handleCancelClick = () => {
      setIsEditing(false);
      setContent(comment.content);
      onCancelEdit();
    };

    return (
      <div>
        {isEditing ? (
          <div className="mt-2">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="3"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveClick}
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Check className="w-4 h-4" /> Save
              </button>
              <button
                onClick={handleCancelClick}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 text-white">{comment.content}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onToggleLike(comment._id)}
                  className={`flex items-center space-x-1 ${
                    comment.isLiked
                      ? "text-purple-500 hover:text-purple-600"
                      : "text-gray-400 hover:text-white"
                  } transition-colors`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      comment.isLiked ? "fill-current" : ""
                    }`}
                  />
                  <span className="text-sm">{comment.totalLikes || 0}</span>
                </button>

                {userData?.username === comment.owner.username && (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
                      title="Edit comment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black border border-gray-700/50 rounded-xl p-4 shadow-lg">
      <DeleteConfirmDialog />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-white font-bold">
          {totalCommentsRef.current} Comments
        </h2>
        <div className="flex items-center gap-4">
          {" "}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="top">Top comments</option>
            <option value="newest">Newest first</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCcw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>
      <ToastContainer />
      <div className="mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-3 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
        />
        <button
          onClick={handleAddComment}
          className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
        >
          Post Comment
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CommentSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={comments.length}
          next={handleLoadMore}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
          endMessage={
            <p className="text-center text-gray-400 py-6">
              {comments.length === 0
                ? "Be the first to comment!"
                : "No more comments to load"}
            </p>
          }
        >
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-4 p-4 border-b border-gray-700/50 hover:bg-gray-900 transition-colors duration-200"
            >
              <img
                src={comment.owner.avatar || "/placeholder.svg"}
                alt={comment.owner.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-white">
                      {comment.owner.fullname}
                    </p>
                    <p className="text-sm text-gray-400">
                      @{comment.owner.username}
                    </p>
                  </div>
                </div>
                <CommentContent
                  comment={comment}
                  onUpdateComment={handleUpdateComment}
                  onCancelEdit={handleCancelEdit}
                  onDelete={(commentId) => setDeleteCommentId(commentId)}
                  onToggleLike={handleToggleLike}
                />
              </div>
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}

export default CommentList;
