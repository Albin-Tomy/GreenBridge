import React from 'react';
import { Navigate } from 'react-router-dom';

const ShgProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.is_shg) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ShgProtectedRoute;