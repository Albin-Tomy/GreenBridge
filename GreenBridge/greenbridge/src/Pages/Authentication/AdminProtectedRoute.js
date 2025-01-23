import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ element }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.is_superuser) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default AdminProtectedRoute;