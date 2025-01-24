import React, { useRef, useState } from "react";
import { Edit2, Trash2, Check, X, ThumbsUp } from "lucide-react";

function CommentContent({
  userData,
  comment,
  onUpdateComment,
  onCancelEdit,
  onDelete,
  onToggleLike,
}) {
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
                  className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`}
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
}

export default CommentContent;
