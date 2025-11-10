// src/router/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    // If no access token, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child component (the actual page)
  return <Outlet />;
};

export default ProtectedRoute;