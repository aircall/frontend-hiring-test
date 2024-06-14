import React from 'react';
import { AuthenticationStatus } from '../../declarations/enums';
import AuthProtection from './AuthProtection';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProtection
      condition={status => status !== AuthenticationStatus.Unauthenticated}
      redirectTo="/login"
    >
      {children}
    </AuthProtection>
  );
};
