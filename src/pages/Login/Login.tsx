import * as React from "react";

import { Flex, Icon, LogoMarkMono, Spacer, useToast } from "@aircall/tractor";

import { FormState } from "./Login.decl";
import { LoginForm } from "./LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../../gql/queries/getUser";

const LOGIN_REJECTED = "LOGIN_REJECTED";

export const LoginPage = () => {
  const { login } = useAuth();
  const [formState, setFormState] = React.useState<FormState>("Idle");
  const { showToast, removeToast } = useToast();

  const navigate = useNavigate();

  const { loading, data } = useQuery(GET_USER, {
    fetchPolicy: "network-only"
  });

  const onSubmit = async (email: string, password: string) => {
    try {
      setFormState("Pending");
      await login({ username: email, password });
      removeToast(LOGIN_REJECTED);
    } catch (error) {
      console.log(error);
      showToast({
        id: LOGIN_REJECTED,
        message: "Invalid email or password",
        variant: "error"
      });
    }
  };

  // Forward to calls page if user is already logged in
  useEffect(() => {
    if (!loading && data?.me) {
      navigate("/calls");
    }
  }, [data?.me, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Spacer p={5} h="100%" direction="vertical" justifyContent="center" fluid space={5}>
      <Flex alignItems="center">
        <Icon component={LogoMarkMono} size={60} mx="auto" />
      </Flex>
      <LoginForm onSubmit={onSubmit} formState={formState} />
    </Spacer>
  );
};
