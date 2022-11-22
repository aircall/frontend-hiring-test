# REST API

Base URL: https://frontend-test-api.aircall.dev

## Authentication

You must first authenticate yourself before requesting the API. You can do so by sending a POST request to `/auth/login`. See below.

## GET endpoints

All the endpoints are protected by a middleware that checks if the user is authenticated with a valid JWT.

`GET` `/calls` returns a list of paginated calls. You can fetch the next page of calls by changing the values of `offset` and `limit` arguments.

```
/calls?offset=<number>&limit=<number>
```

Response:

```
{
  nodes: [Call!]
  totalCount: Int!
  hasNextPage: Boolean!
}
```

`GET` `/calls/:id` return a single call if any, otherwise it returns null.

```
/calls/:id<uuid>
```

`GET` `/me` return the currently authenticated user.

```
/me
```

Response

```
{
  id: String!
  username: String!
}
```

## POST endpoints

To be able to grab a valid JWT token, you need to call the following endpoint:

`POST` `/auth/login` receives the username and password in the body and returns the access_token and the user identity.

Body

```JSON
{
  "username": String!,
  "password": String!
}
```

Response

```JSON
{
  "access_token": String!,
  "refresh_token": String!,
  "user": UserType!
}
```

Once you are correctly authenticated you need to pass the Authorization header for all the next calls to the REST API.

```JSON
{
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
}
```

**New Refresh Token Endpoint (RECOMMENDED)**

Note that the `access_token` is only available for 10 minutes and the `refresh_token` is available for 1 hour. You need to ask for another fresh access token by calling the `/auth/refresh-token-v2` endpoint passing along the `refresh_token` in the `Authorization` header

Like so:

```JSON
`POST` `/auth/refresh-token-v2`

Header
{
  "Authorization": "Bearer <REFRESH_TOKEN>"
}
```

**Deprecated Refresh Token Endpoint**

Note that the `access_token` is only available for 10 minutes. You need to ask for another fresh token by calling the `/auth/refresh-token` endpoint before the token gets expired.passing along the `access_token` in the `Authorization` header.

Like so:

```JSON
`POST` `/auth/refresh-token`

Header
{
  "Authorization": "Bearer <ACCESS_TOKEN>"
}
```

You must use the new tokens for the new requests made to the API.

`POST` `/calls/:id/note` create a note and add it prepend it to the call's notes list.

```
`/calls/:id/note`

Body
{
  content: String!
}
```

It returns the `Call` as a response or an error if the note doesn't exist.

## PUT endpoints

`PUT` `/calls/:id/archive` as the name implies it either archive or unarchive a given call. If the call doesn't exist, it'll throw an error.

```
PUT /calls/:id/archive
```

## Real-time

In order to be aware of the changes done on a call, you need to subscribe to this private channel: `private-aircall` and listen for the following event: `update-call` which will return the call payload.

This event will be called each time you add a note or archive a call.

Note that, you need to use Pusher SDK in order to listen for this event.

Because this channel is private you need to authenticate first, to do that, you need to make

- `APP_AUTH_ENDPOINT` point to: `https://frontend-test-api.aircall.dev/pusher/auth`
- set `APP_KEY` to `d44e3d910d38a928e0be`
- and set `APP_CLUSTER` to `eu`

## Errors

The REST API can return a different type of errors:

`400` `BAD_REQUEST` error, happens when you provide some data which doesn't respect a given shape.

Example

```
{
  "statusCode": 400,
  "message": [
    "content must be a string",
    "content should not be empty"
  ],
  "error": "Bad Request"
}
```

`401` `UNAUTHORIZED` error, happens when the user is not authorized to perform an action or if his token is no longer valid

Example

```
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

`404` `NOT_FOUND` error, happens when the user requests a resource that no longer exists.

Example

```
{
  "statusCode": 404,
  "message": "The call does not exist!",
  "error": "Not Found"
}
```
