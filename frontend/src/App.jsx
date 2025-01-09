import React, { useState, useEffect } from "react";
import apiClient from "./services/api";
import { useDispatch } from "react-redux";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);

  useEffect(() => {
    const healthCheck = async () => {
      try {
        const response = await apiClient.get("/healthcheck");
        console.log("Healthcheck:", response.data);
      } catch (error) {
        setError("Healthcheck failed. Server might be down.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    healthCheck();
    const interval = setInterval(healthCheck, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {}, []);

  return (
    <>
      <h1>Video Zone App</h1>
    </>
  );
}

export default App;
