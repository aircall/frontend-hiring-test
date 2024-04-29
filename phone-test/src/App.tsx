import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { LoginPage } from './pages/Login/Login';
import { CallsListPage } from './pages/CallsList';
import { CallDetailsPage } from './pages/CallDetails';
import { Tractor } from '@aircall/tractor';
import { onError } from '@apollo/client/link/error';

// import { REFRESH_TOKEN_MUTATION } from './gql/queries';

import { REFRESH_TOKEN } from './gql/mutations';

import './App.css';
import { ProtectedLayout } from './components/routing/ProtectedLayout';
import { darkTheme } from './style/theme/darkTheme';
import { RouterProvider } from 'react-router-dom';
import { GlobalAppStyle } from './style/global';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, ApolloLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { AuthProvider } from './hooks/useAuth';

const httpLink = createHttpLink({
  uri: 'https://frontend-test-api.aircall.dev/graphql'
});

// In summary, this code sets up an Apollo Link (authLink) that automatically adds the access token from the local storage to the Authorization header of outgoing HTTP requests, providing a convenient way to include authentication information in GraphQL requests.
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const accessToken = localStorage.getItem('access_token');
  const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${parsedToken}` : ''
    }
  };
});



export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const parseRefreshToken = refreshToken ? JSON.parse(refreshToken) : null;
    localStorage.setItem('access_token', JSON.stringify(parseRefreshToken));

    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN
    });

    if (data?.refreshTokenV2) {
      localStorage.setItem('access_token', JSON.stringify(data?.refreshTokenV2?.access_token));
      localStorage.setItem('refresh_token', JSON.stringify(data?.refreshTokenV2?.refresh_token));
      return data?.refreshTokenV2?.access_token;
    }
    return null;
  } catch (error) {
    console.error('Error executing mutation', error);
    return null;
  }
};

export const errorLink = onError(({ graphQLErrors, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      if (message === 'Unauthorized') {
        // Returning flow from here as we do not want to refetch the api which is throwing unauthorized error
        if (operation.operationName === 'refreshTokenV2') return;

        (async () => {
          try {
            const accessToken = await getRefreshToken();
            if (!accessToken) {
              throw new Error('Login Required');
            }
            window.location.reload();
          } catch (e) {
            window.localStorage.clear();
            window.location.href = '/login';
          }
        })();
      }
    });
  }
});

const links = [authLink, errorLink, httpLink];

const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: ApolloLink.from(links),
  cache: new InMemoryCache()
});
// check if user is logged in, if so redirect  to calls page else login page
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AuthProvider />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/calls" element={<ProtectedLayout />}>
        <Route path="/calls" element={<CallsListPage />} />
        <Route path="/calls/:callId" element={<CallDetailsPage />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <Tractor injectStyle theme={darkTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
        <GlobalAppStyle />
      </ApolloProvider>
    </Tractor>
  );
}

export default App;
