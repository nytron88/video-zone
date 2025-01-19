import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ChannelProfile() {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("videos");

  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "playlist", label: "Playlist" },
    { id: "tweets", label: "Tweets" },
    { id: "subscriptions", label: "Subscriptions" },
  ];
}
