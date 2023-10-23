import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProtectedLayout from './ProtectedLayout';

export const ProtectedRoute = () => {
  // TODO check that the user is authenticated before displaying the route
  const { user, status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== 'Idle') return;
    if (!user && window.location.pathname !== '/login') navigate('/login');
  }, [user, status, navigate]);

  return (
    <ProtectedLayout>
      <Outlet />
    </ProtectedLayout>
  );
};
