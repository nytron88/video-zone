import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateComment, deleteComment } from "../../store/slices/commentSlice";
import { toggleCommentLike } from "../../store/slices/likeSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import { ToastContainer } from "../index";
import { Link } from "react-router-dom";
import CommentSkeleton from "./CommentSkeleton";
import { DeleteConfirmDialog } from "../index";
import CommentContent from "./CommentContent";
import LoadingIndicator from "./LoadingIndicator";

function CommentList({ identifier, getCommentsAction, addCommentAction }) {
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
  const seenCommentIds = useMemo(() => new Set(), [identifier]);
  const LIMIT = 10;

  const fetchComments = useCallback(
    async (pageNum, isRefresh = false) => {
      try {
        const response = await dispatch(
          getCommentsAction({ identifier, page: pageNum, limit: LIMIT, sortBy })
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
    [dispatch, identifier, seenCommentIds, sortBy]
  );

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    setIsLoading(true);
    seenCommentIds.clear();
    fetchComments(1);
  }, [fetchComments, identifier]);

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
        addCommentAction({ identifier, content: newComment })
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

  return (
    <div className="bg-black border border-gray-700/50 rounded-xl p-4 shadow-lg">
      <DeleteConfirmDialog
        deleteItemId={deleteCommentId}
        setDeleteItemId={setDeleteCommentId}
        handleDeleteConfirm={handleDeleteConfirm}
      />
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
              className="flex items-start gap-2 p-4 border-b border-gray-700/50 hover:bg-gray-900 transition-colors duration-200"
            >
              <Link
                to={`/channel/${comment.owner.username}`}
                className="hover:bg-gray-800 p-2 rounded-full transition-all duration-200"
              >
                <img
                  src={comment.owner.avatar || "/placeholder.svg"}
                  alt={comment.owner.fullname}
                  className="w-10 h-10 rounded-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <Link
                    to={`/channel/${comment.owner.username}`}
                    className="group flex flex-col hover:bg-gray-800 p-2 rounded-lg transition-all duration-200"
                  >
                    <p className="font-bold text-white group-hover:text-blue-400 transition-all duration-200">
                      {comment.owner.fullname}
                    </p>
                    <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-all duration-200">
                      @{comment.owner.username}
                    </p>
                  </Link>
                </div>
                <CommentContent
                  userData={userData}
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

export default memo(CommentList);
