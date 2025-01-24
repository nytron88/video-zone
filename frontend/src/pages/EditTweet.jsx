import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTweetById } from "../store/slices/tweetSlice";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { EditTweet as EditTweetComponent, ToastContainer } from "../components";

function EditTweet() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tweetId } = useParams();
  const { data: userData } = useSelector((state) => state.user);
  const [tweet, setTweet] = useState(null);

  const fetchTweet = useCallback(async () => {
    try {
      const response = await dispatch(getTweetById(tweetId)).unwrap();
      if (response.owner._id !== userData._id) {
        throw new Error("You are not authorized to edit this tweet");
      }

      setTweet(response);
    } catch (err) {
      toast.error(err.message);
      return navigate("/");
    }
  }, [dispatch, tweetId, userData]);

  useEffect(() => {
    fetchTweet();
  }, [fetchTweet]);

  return (
    <>
      <ToastContainer />
      <EditTweetComponent tweet={tweet} />
    </>
  );
}

export default EditTweet;
