import { FetchResult } from '@apollo/client';
interface LoginInput {
  username: String;
  password: String;
}

interface AuthResponseType {
  access_token: String;
  refresh_token: String;
  user: UserType;
}

interface DeprecatedAuthResponseType {
  access_token: String;
  user: UserType;
}

export interface AuthContextProps {
  user: UserType | null;
  status: Status;
  accessToken: string | null;
  refreshToken: string | null;
  login: ({
    username,
    password
  }: {
    username: string;
    password: string;
  }) => Promise<FetchResult<any>>;
  logout: () => void;
}
