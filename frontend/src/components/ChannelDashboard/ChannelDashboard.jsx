import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getChannelStats,
  getChannelVideos,
} from "../../store/slices/dashboardSlice";
import { Loader, ToastContainer } from "../index";
import StatCard from "./StatCard";
import VideoList from "./VideoList";
import { toast } from "react-toastify";

function ChannelDashboard() {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: userData } = useSelector((state) => state.user);

  // Fetch channel stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const fetchedData = await dispatch(
          getChannelStats(userData._id)
        ).unwrap();
        setStats(fetchedData);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dispatch, userData]);

  // Fetch videos callback
  const fetchVideos = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      try {
        const fetchedData = await dispatch(
          getChannelVideos({
            channelId: userData._id,
            page: pageNum,
            limit: 10,
          })
        ).unwrap();

        setVideos((prev) =>
          isRefresh ? fetchedData : [...prev, ...fetchedData]
        );
      } catch (error) {
        toast.error("Failed to fetch videos");
      }
    },
    [dispatch, userData._id]
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader />
      </div>
    );

  return (
    <div className="p-4 md:p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl text-white font-semibold mb-4 md:mb-6 text-center">
          Channel Dashboard
        </h1>
        <ToastContainer />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            icon="👁️"
            label="Total Views"
            value={stats?.totalViews || 0}
          />
          <StatCard
            icon="👤"
            label="Total Subscribers"
            value={stats?.totalSubscribers || 0}
          />
          <StatCard
            icon="👍"
            label="Total Likes"
            value={stats?.totalLikes || 0}
          />
        </div>
        <VideoList
          videos={videos}
          setVideos={setVideos}
          fetchVideos={fetchVideos}
        />
      </div>
    </div>
  );
}

export default ChannelDashboard;
