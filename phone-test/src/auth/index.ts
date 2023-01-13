import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import errorLink from './errorLink';
import authLink from './authlink';

const httpLink = createHttpLink({ uri: `${process.env.REACT_APP_API_URL}` });

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  credentials: 'include'
});

export default client;
