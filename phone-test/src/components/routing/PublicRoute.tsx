import React from 'react';
import { AuthenticationStatus } from '../../declarations/enums';
import AuthProtection from './AuthProtection';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProtection
      condition={status => status === AuthenticationStatus.Unauthenticated}
      redirectTo="/calls"
    >
      {children}
    </AuthProtection>
  );
};
