import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ProtectedLayout } from './ProtectedLayout';

export const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { status } = useAuth();

  if (status === 'unauthenticated') {
    return <Navigate to={redirectPath} replace />;
  }

  return <ProtectedLayout />;
};
