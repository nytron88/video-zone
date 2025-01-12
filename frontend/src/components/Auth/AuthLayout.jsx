import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "../index";

function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    if (loading) return;

    if (authentication && !authStatus) {
      navigate("/login");
    } else if (!authentication && authStatus) {
      navigate("/");
    }
  }, [authStatus, navigate, authentication]);

  return loading ? (
    <>
      <Loader />
    </>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
