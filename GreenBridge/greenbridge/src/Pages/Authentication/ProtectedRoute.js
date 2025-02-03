import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!localStorage.getItem('authToken');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  const hasRequiredRole = allowedRoles.some(role => user[role] === true);
  
  if (!hasRequiredRole) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
