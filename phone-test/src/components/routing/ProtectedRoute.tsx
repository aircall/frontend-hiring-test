import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { ProtectedLayout } from './ProtectedLayout';

export const ProtectedRoute = () => {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  // TODO check that the user is authenticated before displaying the route
  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!user && window.location.pathname !== '/login') navigate('/login');
  }, [user, status, navigate]);

  return (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  );
};
