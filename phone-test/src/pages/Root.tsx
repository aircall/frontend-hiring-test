import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export const Root = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    navigate(user ? '/calls' : '/login', { replace: true });
  }, []);

  return <Outlet />;
};
