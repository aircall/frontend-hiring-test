import { Outlet, Link } from "react-router-dom";
import { Box, Flex, Spacer, Grid } from "@aircall/tractor";
import logo from "../../logo.png";
import { useAuth } from "../../hooks/useAuth";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../gql/queries/getUser";
import { useCallback } from "react";
import useRedirectToLogin from "../../hooks/useRedirectToLogin";

export const ProtectedLayout = () => {
  const { logout } = useAuth();

  const { loading, error, data } = useQuery(GET_USER);
  const handleLogOut = useCallback(logout, [logout]);

  useRedirectToLogin(error);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.me) {
    return <div>You aren't authorized to view this page.</div>;
  }

  return (
    <Box minWidth="100vw" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        <Link to="/calls">
          <img src={logo} alt="Aircall" width="32px" height="32px" />
        </Link>
        <Spacer space="m" alignItems="center">
          <span>{`Welcome ${data.me.username}!`}</span>
          <button onClick={handleLogOut}>logout</button>
        </Spacer>
      </Flex>
      <Grid w="500px" mx="auto" rowGap={2}>
        <Outlet />
      </Grid>
    </Box>
  );
};
