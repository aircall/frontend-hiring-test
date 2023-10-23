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

export type LoginResultType = {
  data?: {
    login: AuthResponseType;
  };
};

export type RefreshTokenResultType = {
  refreshTokenV2: AuthResponseType;
};