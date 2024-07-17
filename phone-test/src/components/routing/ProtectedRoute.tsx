import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired } from '../../helpers/isTokenExpired';
import { useToken } from '../../hooks/useToken';

const ProtectedRoute: React.FC = () => {
  const { accessToken } = useToken();
  if (isTokenExpired(accessToken)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export { ProtectedRoute };
