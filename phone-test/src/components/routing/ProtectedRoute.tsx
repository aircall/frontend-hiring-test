import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ProtectedLayout } from './ProtectedLayout';
import { PATHS } from '../../constants/paths';

export const ProtectedRoute = ({ redirectPath = PATHS.LOGIN }) => {
  const { status } = useAuth();

  if (status === 'unauthenticated') {
    return <Navigate to={redirectPath} replace />;
  }

  return <ProtectedLayout />;
};
