import { Token } from '../../helpers/constants';

export const getAccessToken = () => {
  const accessToken = localStorage.getItem(Token.ACCESS);
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  return accessToken ? `Bearer ${parsedToken}` : '';
};
