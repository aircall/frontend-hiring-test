interface LoginInput {
  username: string;
  password: string;
}

interface AuthResponseType {
  access_token: string;
  refresh_token: string;
  user: UserType;
}

interface DeprecatedAuthResponseType {
  access_token: string;
  user: UserType;
}
