import React, { createContext, useContext, useState, useCallback } from 'react';
import { REFRESH_TOKEN_V2 } from '../gql/mutations';
import { Token } from '../helpers/constants';
import { getAccessToken } from '../apollo/shared/token';
import { useApolloClient } from '@apollo/client';

interface TokenContextType {
  getNewToken: () => Promise<string>;
  refreshToken: () => string | undefined;
  accessToken: string;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apolloClient = useApolloClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshToken = useCallback(() => {
    const newToken = window.localStorage.getItem(Token.REFRESH);
    if (!newToken) {
      window.localStorage.clear();
      window.location.reload();
      return;
    }
    return newToken;
  }, []);

  const getNewToken = useCallback(async () => {
    if (isRefreshing) {
      return Promise.reject('Got in a loop refreshing. Needs to be logged out.');
    }

    window.localStorage.setItem(Token.REFRESH, JSON.stringify(refreshToken));

    setIsRefreshing(true);
    try {
      const {
        data: { refreshTokenV2 }
      } = await apolloClient.mutate({
        mutation: REFRESH_TOKEN_V2,
        context: {
          headers: {
            authorization: refreshToken
          }
        }
      });

      const accessToken = refreshTokenV2.access_token;

      localStorage.setItem(Token.ACCESS, accessToken);

      window.dispatchEvent(
        new StorageEvent('storage', { key: Token.ACCESS, newValue: accessToken })
      );

      return accessToken;
    } finally {
      setIsRefreshing(false);
    }
  }, [apolloClient, isRefreshing, refreshToken]);

  const accessToken = getAccessToken();
  return (
    <TokenContext.Provider value={{ getNewToken, accessToken, refreshToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};
