import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

export const AppRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      navigate('/calls');
    } else {
      navigate('/login');
    }
  }, []);

  return <Outlet />;
};
