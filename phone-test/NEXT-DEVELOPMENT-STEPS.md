# Next Development Steps

The following is a big-picture list of some of the improvements we can make before deploying the application to production.

## Migrating the app to Vite

As create-react-app is no longer the recommended way to create new React.js apps and has been replaced by Next.js and Vite, we should migrate the app before adding many more features. Vite offers better support, improved capabilities, a large community, a great testing Developer Experience through vitest, and, above all, is actively maintained, as opposed to create-react-app, which stopped receiving support over two years ago.

## Accessibility

We need to improve the accessibility of all components in the app, ensuring that:

- All elements that are interactable can be reached through the keyboard and can be interacted with through screen readers.
- All elements have accurate labels, roles, and semantic HTML tags.
- The styles of the app are fully responsive.
- We comply with the Web Content Accessibility Guidelines (WCAG) 2.1.

## Adding new features

- Filters without the "last 200 calls" limitation. We need the backend team's help for this, as they should add filters as a new argument within the paginatedCalls query.
- Possibility to add notes to the calls from within the CallDetails.tsx page. We can use the existing addNote mutation.

## Living Documentation

- Adding Storybook and creating stories for our components.
- Considering the addition of documentation files for key aspects of the application through .md files located in the corresponding directories or the addition of comments in areas of the application where the code is inherently complex and hard to understand.

## Testing

- Setting up Jest so that it works with .tsx files, allowing us to create unit and integration tests. Following the Jest documentation has not worked: [Jest Getting Started](https://jestjs.io/docs/getting-started#using-typescript).
- Ensuring that we cover all user stories with the corresponding unit, integration, and end-to-end tests.
- Aiming for a minimum of 85% code coverage for components.
- Setting up CI pipelines through GitHub Actions, so that:
  - When we create a PR, and every time we push new changes to it, the unit and integration tests are executed. If they fail, it will not be possible to merge the PR.
  - When we merge a PR, end-to-end tests are executed. If they fail, the PR will not be merged.
- Key components and logic that should be unit tested: tokenExpiredLink.ts, useAuth, CallItem, CallFilters.
- Creating more end-to-end tests, covering: archive feature, pagination, and the upcoming feature for adding notes to calls.

## Polishing

- Adding necessary environment variables, such as GRAPHQL_API_ENDPOINT and GRAPHQL_WS_ENDPOINT for replacing hard-coded strings.
- Ensuring that all new components added fulfill our Design System's criteria, including sizes, colors, spacing, etc.
- Considering the addition of @graphql-codegen/cli for generating typed document nodes and avoiding the need to write our GraphQL operations in TypeScript files. This way, we can write our operations in gql files that will be transformed into fully typed documents (including variables and data).
- Considering the addition of ESLint and Stylelint and agreeing on a team-wide set of coding standards so that we can configure both tools to our needs, allowing us to write more consistent code.
- Adding a monitoring tool such as Datadog or Sentry to the application to log any errors that might occur, enabling us to identify and address issues promptly.
