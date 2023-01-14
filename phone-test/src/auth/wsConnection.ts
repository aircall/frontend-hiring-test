import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { refreshToken, getAccessToken } from './token';

const subscriptionClient = new SubscriptionClient(`${process.env.REACT_APP_WS_URL}`, {
  lazy: true,
  reconnect: true,
  connectionParams: async () =>
    await refreshToken().then(() => {
      return {
        authorization: getAccessToken()
      };
    }),
  timeout: 30000
});

const wsLink = new WebSocketLink(subscriptionClient);

export default wsLink;
