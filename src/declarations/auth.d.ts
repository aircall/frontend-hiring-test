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
