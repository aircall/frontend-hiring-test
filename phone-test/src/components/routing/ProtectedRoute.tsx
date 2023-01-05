import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Use this wrapper on Routes as a guards to validate is user is authenticated 
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const { isAuth } = useAuth();

  if(!isAuth()) {
    return <><Navigate to="/login" /></>
  }

  return <>{children}</>;
};
