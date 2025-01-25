import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Pencil, X } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatYouTubeTime, formatDate } from "../../services/formatFigures";
import {
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  removeVideoFromPlaylist,
} from "../../store/slices/playlistSlice";
import { Loader, Error, DeleteConfirmDialog, ToastContainer } from "../index";
import { toast } from "react-toastify";

function PlaylistDisplay() {
  const dispatch = useDispatch();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const { playlistId } = useParams();
  const { data: userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const playlistNameRef = useRef(null);
  const playlistDescriptionRef = useRef(null);

  const fetchPlaylist = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(getPlaylistById(playlistId)).unwrap();
      setPlaylist(response);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, playlistId]);

  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const newName = playlistNameRef.current.value.trim();
    const newDescription = playlistDescriptionRef.current.value.trim();

    if (newName === playlist.name && newDescription == playlist.description) {
      toast.error("No changes made!");
    }

    let updateFields = {};

    if (newName && newName !== playlist.name) updateFields.name = newName;
    if (newDescription && newDescription !== playlist.description)
      updateFields.description = newDescription;

    dispatch(
      updatePlaylist({
        playlistId: playlist._id,
        name: updateFields.name || null,
        description: updateFields.description || null,
      })
    );

    setPlaylist((prev) => {
      return {
        ...prev,
        name: updateFields.name || prev.name,
        description: updateFields.description || prev.description,
      };
    });

    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    dispatch(deletePlaylist(deleteItemId));
    setDeleteItemId(null);
    navigate(`/channel/${userData.username}`);
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      const response = await dispatch(
        removeVideoFromPlaylist({ playlistId: playlist._id, videoId })
      ).unwrap();

      console.log(playlist);

      setPlaylist((prev) => {
        return {
          ...prev,
          videos: prev.videos.filter((video) => video._id !== videoId),
        };
      });
      toast.success("Video removed from playlist!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <Loader />;

  if (errorMessage) return <Error message={errorMessage} />;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          {isEditing ? (
            <div className="space-y-4 flex-grow">
              <input
                type="text"
                defaultValue={playlist.name}
                ref={playlistNameRef}
                className="w-full bg-zinc-800/50 px-4 py-2 rounded-lg text-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Playlist name"
              />
              <input
                type="text"
                defaultValue={playlist.description}
                ref={playlistDescriptionRef}
                className="w-full bg-zinc-800/50 px-4 py-2 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a description"
              />
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <div className="flex-grow">
                <h1 className="text-3xl font-bold">{playlist.name}</h1>
                <p className="text-gray-400 mt-2 max-w-2xl">
                  {playlist.description}
                </p>
                <p className="text-gray-300 mt-1">
                  Total Videos: {playlist.videos.length}
                </p>
              </div>
              {userData?._id === playlist?.owner._id && (
                <div className="flex gap-4">
                  <button
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Edit Playlist"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteItemId(playlist._id)}
                    className="text-red-500 hover:text-red-300 transition-colors"
                    title="Delete Playlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {playlist.videos.length === 0 && (
          <div className="bg-gray-800/30 rounded-xl p-4 text-center">
            <p className="text-gray-400">No videos found in this playlist!</p>
          </div>
        )}

        <div className="space-y-6">
          {playlist.videos.map((video) => (
            <div
              key={video._id}
              className="group bg-gray-800/30 hover:bg-gray-800/50 rounded-xl p-4 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <Link
                  to={`/video/${video._id}`}
                  className="flex-shrink-0 relative w-full md:w-64 aspect-video overflow-hidden rounded-lg group-hover:ring-2 ring-cyan-400/30 transition-all"
                >
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                    {formatYouTubeTime(video.duration)}
                  </span>
                </Link>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <Link
                        to={`/video/${video._id}`}
                        className="text-gray-100 font-semibold text-lg hover:text-cyan-400 transition-colors line-clamp-2"
                      >
                        {video.title}
                      </Link>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                    {userData?._id === playlist?.owner._id && (
                      <button
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                        onClick={() => handleRemoveVideo(video._id)}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={video.owner.avatar}
                        alt={video.owner.username}
                        className="w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-cyan-400 transition-all"
                      />
                      <span className="text-gray-300 hover:text-cyan-400 transition-colors">
                        {video.owner.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{video.views.toLocaleString()} views</span>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DeleteConfirmDialog
          deleteItemId={deleteItemId}
          handleDeleteConfirm={handleDeleteConfirm}
          setDeleteItemId={setDeleteItemId}
        />
      </div>
    </div>
  );
}

export default PlaylistDisplay;
