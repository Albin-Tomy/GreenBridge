import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const userId = localStorage.getItem('userId');

  if (!userId || userId === undefined) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
