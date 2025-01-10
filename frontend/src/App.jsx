import React, { useState, useEffect } from "react";
import apiClient from "./services/api";
import { useDispatch } from "react-redux";
import { refreshToken } from "./store/slices/authSlice";
import { getCurrentUser } from "./store/slices/userSlice";
import { Loader, Footer, Header, Error } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const [healthCheckComplete, setHealthCheckComplete] = useState(false);
  const [userCheckComplete, setUserCheckComplete] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const healthCheck = async () => {
      try {
        const response = await apiClient.get("/healthcheck");
        console.log("Healthcheck:", response.data);
      } catch (error) {
        setError("Healthcheck failed. Server might be down.");
        console.error(error);
      } finally {
        setHealthCheckComplete(true);
      }
    };

    healthCheck();
    const interval = setInterval(healthCheck, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setExistingUser = async () => {
      const tokenAction = await dispatch(refreshToken());
      if (tokenAction.error) {
        console.error(tokenAction.error);
      }

      const userAction = await dispatch(getCurrentUser());

      if (userAction.error) {
        console.error(userAction.error);
      }

      setUserCheckComplete(true);
    };

    setExistingUser();
  }, [dispatch]);

  useEffect(() => {
    if (healthCheckComplete && userCheckComplete) {
      setLoading(false);
    }
  }, [healthCheckComplete, userCheckComplete]);

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
