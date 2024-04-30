import { SubscriptionClient } from 'subscriptions-transport-ws';

export const getWsClient = (ws_connection: string) => new SubscriptionClient(ws_connection, {
    lazy: true,
    reconnect: true,
    connectionParams: () => {
      const accessToken = localStorage.getItem('access_token') ? JSON.parse(localStorage.getItem('access_token')!) : null;
      return {
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      };
    }
  });