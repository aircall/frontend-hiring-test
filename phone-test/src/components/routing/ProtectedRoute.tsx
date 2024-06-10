import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { AuthenticationStatus } from '../../declarations/enums';
import { Loader } from '../Loader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === AuthenticationStatus.Unauthenticated) {
      navigate('/login');
    }
  }, [status, navigate]);

  if (status === AuthenticationStatus.Loading) {
    return <Loader />;
  }

  return <>{children}</>;
};
