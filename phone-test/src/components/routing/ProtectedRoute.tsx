import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = () => {
  const { checkIsLoggedIn } = useAuth();
  const isLoggedIn = checkIsLoggedIn();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};
