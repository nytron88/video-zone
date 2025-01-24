import React, { useState, useEffect, useCallback } from "react";
import { getVideoById } from "../store/slices/videoSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { EditVideo as EditVideoComponent, ToastContainer } from "../components";

function EditVideo() {
  const { videoId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: userData } = useSelector((state) => state.user);
  const [video, setVideo] = useState(null);

  const fetchVideo = useCallback(async () => {
    try {
      const response = await dispatch(getVideoById({ videoId })).unwrap();
      if (response.owner._id !== userData._id) {
        throw new Error("You are not authorized to edit this video");
      }

      setVideo(response);
    } catch (err) {
      toast.error(err.message);
      return navigate("/");
    }
  }, [dispatch, videoId, userData]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  return (
    <>
      <ToastContainer />
      <EditVideoComponent video={video} />
    </>
  );
}
export default EditVideo;
