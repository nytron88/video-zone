import React from "react";
import { useParams } from "react-router-dom";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../../store/slices/playlistSlice";
import { useDispatch, useSelector } from "react-redux";

function PlaylistDisplay() {
  const { playlistId } = useParams();
}

export default PlaylistDisplay;
