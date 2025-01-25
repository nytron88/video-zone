import React, { useCallback, useEffect, useState } from "react";
import { getUserChannelProfile } from "../store/slices/userSlice";
import { toggleSubscription } from "../store/slices/subscriptionSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ChannelProfile as ChannelProfileComponent } from "../components";
import { Error, Loader } from "../components";

function ChannelProfile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const [channelDetails, setChannelDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: userData } = useSelector((state) => state.user);

  const fetchChannelProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(getUserChannelProfile(username)).unwrap();
      setChannelDetails(response);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, username]);

  const onToggleSubscription = useCallback(async () => {
    await dispatch(toggleSubscription(channelDetails._id)).unwrap();
    setChannelDetails((prev) => ({
      ...prev,
      subscribersCount: prev.isSubscribed
        ? prev.subscribersCount - 1
        : prev.subscribersCount + 1,
      isSubscribed: !prev.isSubscribed,
    }));
  }, [dispatch]);

  useEffect(() => {
    fetchChannelProfile();
  }, [fetchChannelProfile]);

  if (errorMessage) {
    return <Error message={errorMessage} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ChannelProfileComponent
      channelDetails={channelDetails}
      fetchChannelProfile={fetchChannelProfile}
      toggleSubscription={onToggleSubscription}
      isOwner={userData?.username === username}
    />
  );
}

export default ChannelProfile;
