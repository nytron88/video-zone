import React, { useCallback, useEffect, useState } from "react";
import { getUserChannelProfile } from "../store/slices/userSlice";
import { toggleSubscription } from "../store/slices/subscriptionSlice";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ChannelProfile as ChannelProfileComponent } from "../components";
import { Error } from "../components";

function ChannelProfile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const [channelDetails, setChannelDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchChannelProfile = useCallback(async () => {
    try {
      const response = await dispatch(getUserChannelProfile(username)).unwrap();
      setChannelDetails(response);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [username, dispatch]);

  const onToggleSubscription = useCallback(async () => {
    await dispatch(toggleSubscription(channelDetails._id)).unwrap();
    setChannelDetails((prev) => ({
      ...prev,
      subscribersCount: prev.isSubscribed
        ? prev.subscribersCount - 1
        : prev.subscribersCount + 1,
      isSubscribed: !prev.isSubscribed,
    }));
  }, [dispatch, channelDetails]);

  useEffect(() => {
    fetchChannelProfile();
  }, [fetchChannelProfile]);

  if (errorMessage) {
    return <Error message={errorMessage} />;
  }

  return (
    <ChannelProfileComponent
      channelDetails={channelDetails}
      fetchChannelProfile={fetchChannelProfile}
      toggleSubscription={onToggleSubscription}
    />
  );
}

export default ChannelProfile;
