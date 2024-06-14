export const isTokenRefreshing = (operationName?: string) => operationName === 'RefreshTokenV2';

export const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('access_token', JSON.stringify(accessToken));
  localStorage.setItem('refresh_token', JSON.stringify(refreshToken));
};

export const addAuthHeader = (token: string, headers: any) => ({
  headers: {
    ...headers,
    authorization: token ? `Bearer ${token}` : ''
  }
});
