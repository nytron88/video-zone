import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getVideoById } from "../../store/slices/videoSlice";
import { CommentList, Error, Loader } from "../index";
import VideoDetails from "./VideoDetails";
import VideoPlayer from "./VideoPlayer";
import {
  getVideoComments,
  addVideoComment,
} from "../../store/slices/commentSlice";

function VideoDisplay() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasIncrementedView = useRef(false);
  const dispatch = useDispatch();

  const fetchVideo = async (incrementView = false) => {
    try {
      const response = await dispatch(
        getVideoById({
          videoId,
          incrementView,
        })
      ).unwrap();
      setVideo(response);
    } catch (err) {
      console.error("Failed to fetch video:", err);
      setError("Unable to load video. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchVideo(false);
  }, [videoId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasIncrementedView.current) {
        fetchVideo(true);
        hasIncrementedView.current = true;
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [videoId]);

  if (isLoading) return <Loader />;

  if (!video || error) {
    return (
      <Error
        message={error || "Video not found."}
        details="Most likely the video doesn't exist"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <VideoPlayer videoFile={video.videoFile} title={video.title} />
      <VideoDetails video={video} />
      <CommentList
        identifier={videoId}
        getCommentsAction={getVideoComments}
        addCommentAction={addVideoComment}
      />
    </div>
  );
}

export default VideoDisplay;
