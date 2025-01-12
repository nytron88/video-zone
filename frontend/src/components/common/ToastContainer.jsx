import React from "react";
import { ToastContainer as Toast } from "react-toastify";

function ToastContainer() {
  return (
    <Toast
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}

export default ToastContainer;
