export enum AuthenticationStatus {
  INITIAL_LOADING = 'initial-loading',
  LOGGED_IN = 'logged-in',
  NOT_LOGGED_IN = 'not-logged-in',
  AUTHENTICATING = 'authenticating'
}

export interface AuthContextValue {
  login: ({ username, password }: LoginInput) => void;
  logout: () => void;
  status: AuthenticationStatus;
}
