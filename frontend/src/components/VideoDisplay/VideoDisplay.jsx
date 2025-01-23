import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getVideoById } from "../../store/slices/videoSlice";
import { getUserChannelProfile } from "../../store/slices/userSlice";
import { toggleVideoLike } from "../../store/slices/likeSlice";
import CommentList from "./CommentList";

function VideoDisplay() {
  const { videoId } = useParams();
  return <CommentList videoId={videoId} />;
}

export default VideoDisplay;
