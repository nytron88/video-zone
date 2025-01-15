import React, { useState, useEffect } from "react";
import apiClient from "./services/api";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken, logUser, resetError } from "./store/slices/authSlice";
import { getCurrentUser } from "./store/slices/userSlice";
import { Loader, Footer, Header, Error } from "./components";
import { Outlet } from "react-router-dom";
import abortControllerSingleton from "./services/abortControllerSingleton";

function App() {
  const [healthCheckError, setHealthCheckError] = useState("");
  const [healthCheckLoading, setHealthCheckLoading] = useState(true);
  const [userInitialized, setUserInitialized] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const healthCheck = async () => {
      try {
        setHealthCheckLoading(true);
        const response = await apiClient.get("/healthcheck");
        console.log("Healthcheck:", response.data);
      } catch (error) {
        setHealthCheckError("Healthcheck failed. Server might be down.");
        console.error(error);
      } finally {
        setHealthCheckLoading(false);
      }
    };

    healthCheck();
    const interval = setInterval(healthCheck, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setExistingUser = async () => {
      if (userInitialized) return;

      try {
        const profileAction = await dispatch(getCurrentUser());

        if (getCurrentUser.fulfilled.match(profileAction)) {
          dispatch(logUser());
        } else if (getCurrentUser.rejected.match(profileAction)) {
          const refreshAction = await dispatch(refreshToken());
          if (refreshToken.rejected.match(refreshAction)) {
            console.error("Failed to refresh token. Logging out.");
          }
        }
      } finally {
        setUserInitialized(true);
        dispatch(resetError());
      }
    };

    setExistingUser();

    return () => {
      abortControllerSingleton.clearController();
    };
  }, [dispatch, userInitialized]);

  if (healthCheckError) {
    return <Error message={healthCheckError} />;
  }

  return (
    <>
      {loading || healthCheckLoading ? (
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
