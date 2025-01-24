import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelStats } from "../../store/slices/dashboardSlice";
import { Loader, ToastContainer } from "../index";
import StatCard from "./StatCard";
import VideoList from "./VideoList";
import { toast } from "react-toastify";

function ChannelDashboard() {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { data: userData } = useSelector((state) => state.user);

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

  if (loading) return <Loader />;

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
        <VideoList />
      </div>
    </div>
  );
}

export default ChannelDashboard;
