import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Protect any wrapped route from unauthenticated users.
 * Redirect them to `/login`
 */
export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};
