import { SubscriptionClient } from 'subscriptions-transport-ws';
import { getLocalStorageItem } from '../../helpers/localStorage';
import { ACCESS_TOKEN_KEY } from '../../constants/localStorageKeys';
import { WebSocketLink } from '@apollo/client/link/ws';

let currentWsClient: SubscriptionClient;

export function createWSLink() {
  if (currentWsClient) {
    currentWsClient.close();
  }

  currentWsClient = new SubscriptionClient('wss://frontend-test-api.aircall.dev/websocket', {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      const accessToken = getLocalStorageItem(ACCESS_TOKEN_KEY);

      return {
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      };
    }
  });

  return new WebSocketLink(currentWsClient);
}
