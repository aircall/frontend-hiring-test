import { useMutation } from "@apollo/client";
import { REFRESH_TOKEN } from "../gql/mutations/refreshToken";
import { useLocalStorage } from "./useLocalStorage";
import { REFRESH } from "../services/ApolloClient";

export const useRefresh = () => {
  const [_, setAccessToken] = useLocalStorage('access_token', undefined);
  const [_1, setRefreshToken] = useLocalStorage('refresh_token', undefined);
  const [refresh] = useMutation(REFRESH_TOKEN, {
    context: {
      headers: {
        refresh: REFRESH
      },
    },
    onCompleted: ({ refreshTokenV2 }) => {
      setAccessToken(refreshTokenV2.access_token)
      setRefreshToken(refreshTokenV2.access_token)
    },
  });

  return refresh;
}
