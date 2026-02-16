import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated }) {
  const userId=localStorage.getItem('qeep_userId');
  const location = useLocation();
  if (!isAuthenticated,!userId) {
    return <Navigate to="/" state={{from:location}} replace />;
  }

  return children;
}

export default ProtectedRoute;
