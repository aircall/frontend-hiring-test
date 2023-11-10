import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PATHS } from '../../constants/paths';
import { AuthenticationStatus } from '../../hooks/useAuth/index.decl';

export const PublicRoute = ({ redirectPath = PATHS.CALLS }) => {
  const { status } = useAuth();

  if (status === AuthenticationStatus.LOGGED_IN) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
