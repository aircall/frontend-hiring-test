import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { Constants } from '../constants/constants';
import { REFRESH_TOKEN } from '../gql/mutations/refreshToken';

const getClient = function () {

    // Check if token is expired, returns true if it doesn have token (login)
    const isTokenValid = () : boolean => {
        if (localStorage.getItem('token_expiration')) {
          return new Date(JSON.parse(localStorage.getItem('token_expiration') ?? '')) > new Date();
        }
        return true;
      };


      /**
       * TokenRefreshLink handle events, after getting new token call the original request:
       * @isTokenValidOrUndefined check if token es expired
       * @fetchAccessToken get the new token from backend
       * @handleFetch save the new token on localstorage
       * @handleResponse format the endpoint response
       * @handleError redirect to login if refresh token has expired
       */
      const refreshLink = new TokenRefreshLink({
        accessTokenField: 'access_token',
        isTokenValidOrUndefined: isTokenValid,
        fetchAccessToken: async () => {
    
            const accessToken = localStorage.getItem('refresh_token');
            const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

            const { print } = require('graphql')
            const bodyString = print(REFRESH_TOKEN)

            const response = await fetch(Constants.env.api_url, {
            method: 'POST',
            headers: {
            'content-type': 'application/json',
            'Authorization': accessToken ? `Bearer ${parsedToken}` : ''
            },
            body: JSON.stringify({
            query: bodyString,
            }),
            });
            const json = await response.json();
            return json;
        },
        handleFetch: (access_token: any) => {
            localStorage.setItem('access_token', JSON.stringify(access_token));
        },
        handleResponse: (operation, accessTokenField) => (response: any) => {
            if (!response) return { access_token: null };
            const expirationToken = new Date(new Date().getTime() + Constants.tokenExpirationMinutes * 60000);
            localStorage.setItem('token_expiration', JSON.stringify(expirationToken));
            return { access_token: response.data.refreshTokenV2.access_token };
        },
        handleError: (error: any) => {
            console.error('Cannot refresh access token:', error);
            localStorage.removeItem('token_expiration');
            localStorage.removeItem('access_token');
            localStorage.removeItem('current_user');
            localStorage.removeItem('refresh_token');
            window.document.location.href = '/login?token_expired=true';
        },
      });
 


    const httpLink = createHttpLink({
        uri: Constants.env.api_url,
        fetch
    });

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



    return new ApolloClient({
        link: refreshLink.concat(authLink).concat(httpLink),
        cache: new InMemoryCache()
    });;

}

const AuthService = {
    getClient
};

export default AuthService;


