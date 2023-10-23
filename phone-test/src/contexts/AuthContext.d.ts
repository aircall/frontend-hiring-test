import type { LoginInput, LoginResultType } from '../declarations/auth.d';

export type StatusType = 'Idle' | 'Loading' | 'Error' | 'Init'

export interface State {
  user: string | null;
  status: StatusType;
}

export interface AuthContextType extends State {
  login: (loginInput: LoginInput) => Promise<LoginResultType> | void;
  logout: () => void;
}

// #region Login reducer actions
type LoginAction = {
    type: 'LOGIN';
    payload: {
      user: string;
    };
  };
  
  type LogoutAction = {
    type: 'LOGOUT';
  };
  
  type StatusAction = {
    type: 'STATUS';
    payload: {
      status: StatusType;
    };
  };
  
  export type Actions = LoginAction | LogoutAction | StatusAction;
  // #endregion