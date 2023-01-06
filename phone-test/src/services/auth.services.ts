import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { Constants } from '../constants/constants';
import { REFRESH_TOKEN } from '../gql/mutations/refreshToken';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "@apollo/client/link/ws";

const getClient = function () {

    // Check if token is expired, returns true if it doesn have token (login)
    const isTokenValid = (): boolean => {
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

           return onRefreshToken();
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

    //call server to get the new access token using the refresh token
    const onRefreshToken = async () => {
        const { print } = require('graphql')
        const bodyString = print(REFRESH_TOKEN)

        const response = await fetch(Constants.env.api_url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'Authorization': getRefreshToken()
            },
            body: JSON.stringify({
                query: bodyString,
            }),
        });
        const json = await response.json();
        return json;
    }


    const httpLink = createHttpLink({
        uri: Constants.env.api_url,
        fetch
    });

    // Not supported on server!!
    // const wsLink = new GraphQLWsLink(createClient({
    //     url: Constants.env.ws_url,
    // }));

    const getRefreshToken = () => {
        const accessToken = localStorage.getItem('refresh_token');
        const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

        return accessToken ? `Bearer ${parsedToken}` : '';
    }

    const getToken = () => {
        // get the authentication token from local storage if it exists
        const accessToken = localStorage.getItem('access_token');
        const parsedToken = accessToken ? JSON.parse(accessToken) : undefined;

        return accessToken ? `Bearer ${parsedToken}` : '';
    }

    const subscriptionMiddleware = {
        applyMiddleware: function (req: any, next: any) {
            // Get the current context
            const context = req.getContext();
            context.connectionParams.authorization = getToken();
            next()
        },
    };


    const sc = new SubscriptionClient(Constants.env.ws_url, {
        reconnect: true,
        timeout: 30000,
        connectionParams: () => ({
            authorization: getToken(),
        }),
    });
    sc.use([subscriptionMiddleware]);

    //before reconnecting here ask if token has expired, if yes get the new token
    sc.onReconnecting(async () => {

        if (!isTokenValid()) {
            const json = await onRefreshToken();
            const newToken = json?.data?.refreshTokenV2?.access_token;
            if (newToken) {
                const expirationToken = new Date(new Date().getTime() + Constants.tokenExpirationMinutes * 60000);
                localStorage.setItem('token_expiration', JSON.stringify(expirationToken));
                localStorage.setItem('access_token', JSON.stringify(newToken));
            }
            console.log(json);
         
        }
    })
    const wsLink = new WebSocketLink(sc);


    // The split function takes three parameters:
    //
    // * A function that's called for each operation to execute
    // * The Link to use for an operation if the function returns a "truthy" value
    // * The Link to use for an operation if the function returns a "falsy" value
    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink,
    );

    const authLink = setContext((_, { headers }) => {


        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: getToken()
            },
            connectionParams: {
                authorization: getToken()
            },
        };
    });


    return new ApolloClient({
        link: refreshLink.concat(authLink).concat(splitLink),
        cache: new InMemoryCache()
    });;

}

const AuthService = {
    getClient
};

export default AuthService;




