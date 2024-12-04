import React from "react";
import { Navigate } from "react-router";

//reroute users to login page if not logged in
const ProtectedRoute = ({ user, children }) => {
    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
