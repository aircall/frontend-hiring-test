import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ProtectedLayout } from './ProtectedLayout';
import { PATHS } from '../../constants/paths';
import { AuthenticationStatus } from '../../hooks/useAuth/index.decl';

export const ProtectedRoute = ({ redirectPath = PATHS.LOGIN }) => {
  const { status } = useAuth();

  if (status === AuthenticationStatus.NOT_LOGGED_IN) {
    return <Navigate to={redirectPath} replace />;
  }

  return <ProtectedLayout />;
};
