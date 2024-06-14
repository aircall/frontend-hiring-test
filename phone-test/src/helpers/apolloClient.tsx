import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = new HttpLink({
  uri: "https://frontend-test-api.aircall.dev/graphql"
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem("access_token");
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ""
    }
  };
});

const wsLink = new WebSocketLink(
  new SubscriptionClient("wss://frontend-test-api.aircall.dev/websocket", {
    connectionParams: () => {
      const accessToken = localStorage.getItem("access_token");
      const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;
      return {
        authorization: accessToken ? `Bearer ${parsedToken}` : ""
      };
    }
  })
);

// Split link to send data to each link depending on the operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});
