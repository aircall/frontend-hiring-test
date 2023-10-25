import { LOGIN } from '../../../../gql/mutations';

const data = {
  login: {
    access_token: 'mockAccessToken',
    refresh_token: 'mockRefreshToken',
    user: {
      id: '1',
      username: 'fjrodriguez.353@gmail.com'
    }
  }
};

export const mockLoginMutation = {
  request: {
    query: LOGIN,
    variables: {
      input: {
        username: 'fjrodriguez.353@gmail.com',
        password: 'P4ssw0rd!'
      }
    }
  },
  result: { data }
};
