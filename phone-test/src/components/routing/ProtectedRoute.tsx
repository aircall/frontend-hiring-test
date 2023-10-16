import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO check that the user is authenticated before displaying the route
  const { accessToken, getAccessToken } = useAuth();
  useEffect(() => {
    const interval = setInterval(() => {
      getAccessToken();
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  if (!accessToken) return <Navigate to={'/login'} />;
  return <>{children}</>;
};
