# Aircall Frontend Hiring Test

This project is a small phone application used for Aircall frontend interviews.
It uses **Vite**, **React**, **Apollo Client**, **Zustand**, and **Dayjs**.

## Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

```bash
npm run dev
```

### Testing

Launches the Vitest runner.

```bash
npm run test
```

### Build

Builds the app for production to the `dist` folder.

```bash
npm run build
```

## Important Note on Real-time Features

If you are asked to implement real-time features (Subscriptions), please note that the test server uses the **legacy WebSocket protocol** (`subscriptions-transport-ws`), not the newer `graphql-ws` protocol.

We have pre-installed the `subscriptions-transport-ws` package for you.
You should use `WebSocketLink` from `@apollo/client/link/ws` and `SubscriptionClient` from `subscriptions-transport-ws`.
