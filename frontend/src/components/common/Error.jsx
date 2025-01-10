import React from "react";

function Error({ message }) {
  return (
    <>
      <h1 className="text-white">Error</h1>
      <p className="text-red-500">{message}</p>
    </>
  );
}

export default Error;
