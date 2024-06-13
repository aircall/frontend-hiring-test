import { useEffect } from "react";
import { ApolloError } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@aircall/tractor";

const useRedirectToLogin = (error: ApolloError | undefined) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    console.log({ error });
    if (error?.message === "Unauthorized") {
      showToast({
        message: "Your session has expired, please login again",
        variant: "warning",
        dismissIn: 5000
      });
      navigate("/login", { replace: true });
    }
  }, [error, navigate, showToast]);
};

export default useRedirectToLogin;
