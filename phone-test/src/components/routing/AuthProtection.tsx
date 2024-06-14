import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { AuthenticationStatus } from '../../declarations/enums';
import { Loader } from '../Loader';

interface WithAuthProtectionProps {
  children: React.ReactNode;
  condition: (status: AuthenticationStatus) => boolean;
  redirectTo: string;
}

const AuthProtection = ({ children, condition, redirectTo }: WithAuthProtectionProps) => {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!condition(status)) {
      navigate(redirectTo);
    }
  }, [status, navigate, condition, redirectTo]);

  if (status === AuthenticationStatus.Loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthProtection;
