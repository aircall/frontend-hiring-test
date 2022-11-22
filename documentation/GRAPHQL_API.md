# :phone: Aircall Frontend Hiring Test

GraphQL URL (HTTP): https://frontend-test-api.aircall.dev/graphql

Subscription URL (Websocket - Real-time): wss://frontend-test-api.aircall.dev/websocket

## Authentication

You must first authenticate yourself before requesting the API. You can do so by executing the Login mutation. See below.

## Queries

All the queries are protected by a middleware that checks if the user is authenticated with a valid JWT.

`paginatedCalls` returns a list of paginated calls. You can fetch the next page of calls by changing the values of `offset` and `limit` arguments.

```
paginatedCalls(
  offset: Float = 0
  limit: Float = 10
): PaginatedCalls!

type PaginatedCalls {
  nodes: [Call!]
  totalCount: Int!
  hasNextPage: Boolean!
}
```

`activitiy` returns a single call if any, otherwise it returns null.

```
call(id: Float!): Call
```

`me` returns the currently authenticated user.

```
me: UserType!
```

```
type UserType {
  id: String!
  username: String!
}
```

## Mutations

To be able to grab a valid JWT token, you need to execute the `login` mutation.

`login` receives the username and password as 1st parameter and return the access_token and the user identity.

```graphql
login(input: LoginInput!): AuthResponseType!

input LoginInput {
  username: String!
  password: String!
}

interface AuthResponseType {
  access_token: String!
  refresh_token: String!
  user: UserType!
}

interface DeprecatedAuthResponseType {
  access_token: String!
  user: UserType!
}
```

Once you are correctly authenticated you need to pass the Authorization header for all the next calls to the GraphQL API.

```JSON
{
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
}
```

**New Refresh Token Mutation (RECOMMENDED)**

Note that the `access_token` is only available for 10 minutes and the `refresh_token` is available for 1 hour. You need to ask for another fresh access token by calling the `refreshTokenV2` mutation passing along the `refresh_token` in the `Authorization` header like so:

```JSON
{
  "Authorization": "Bearer <REFRESH_TOKEN>"
}
```

```graphql
mutation refreshTokenV2: AuthResponseType!
```

**Deprecated Refresh Token Mutation**

Note that the `access_token` is only available for 10 minutes. You need to ask for another fresh token by calling the refreshToken mutation before the token gets expired passing along the `access_token` in the `Authorization` header.

Like so:

```JSON
{
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

```graphql
mutation refreshToken: DeprecatedAuthResponseType!
```

You must use the new tokens for the new requests made to the API.

`archiveCall` as the name implies it either archive or unarchive a given call.If the call doesn't exist, it'll throw an error.

```
archiveCall(id: ID!): Call!
```

`addNote` create a note and add it prepend it to the call's notes list.

```
addNote(input: AddNoteInput!): Call!

input AddNoteInput {
  activityId: ID!
  content: String!
}
```

## Subscriptions

To be able to listen for the mutations/changes done on a call, you can call the run the `onUpdateCall` subscription.

```graphql
onUpdateCall: Call!
```

Now, we whenever an call is changed via the `addNote` or `archiveCall` mutations, you will receive a subscription event informing you of this change.

_Don't forget to pass the Authorization header with the right access token in order to be able to listen for these changes_
