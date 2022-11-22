export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO check that the user is authenticated before displaying the route
  return <>{children}</>;
};
