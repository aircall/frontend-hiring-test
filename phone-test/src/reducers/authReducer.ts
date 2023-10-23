import type { State } from 'contexts/AuthContext.d';
import type { Actions } from 'contexts/AuthContext.d';

export default function authReducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'LOGIN': {
      const { user } = action.payload;
      return {
        ...state,
        user: user,
        status: 'Idle'
      };
    }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    case 'STATUS':
      return {
        ...state,
        status: action.payload.status
      };
    default:
      return state;
  }
}
