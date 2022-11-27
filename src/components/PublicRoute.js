import React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = localStorage.getItem("user");
  if (user) {
    return <Navigate to="/" />;
  } else return children;
}

export default PublicRoute;
