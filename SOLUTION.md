# Solution

I've fix all the issues that were asked in the instructions of the test. For instance:

- improve the pagination in the calls list view. The app displays a dropdown to let users change the number of calls per page. But it actually has no impact on the UI. Please fix that.

- add a filtering feature in the calls list view. You can for instance filter on the call type, or the direction.

- group calls per day. For instance, if 3 calls were made the same day, group them into the same section.

- fix the logout feature. For now, it does redirect the users to the login page but they are automatically redirected back to the calls list.

- fix the token expiration UX. Access tokens are invalid after 10 minutes, making all new requests fail. Either improve the user experience by redirecting users to the login page with an information toast or use the refresh token (see API docs).

And on the other hand I've added the following features that were asked as well:

- add unit tests for the date helper functions.

- add an end to test for the feature of your choice. For instance, test that users can log into the app, access to the details of call and log out.

- implement the archive call feature and add real-time support. Meaning that if you open the app in 2 tabs, archive a call from the first tab, the second tab must reflect this change. Create a PR for this feature as if you were submitting it to our team, for it to be merged and released in production. As we try to work asynchronously, writing skills are important to us.

## Potential improvements

There are some fields that could have been improved but due to my restricted and limited availability I couldn't perform. Although it would be nice to comment some of these if I have the chance:

- Code can be organized in a way readability and maintainability would be improved (for example, moving initialization code to its own file).

- Add more unit tests and e2e tests. For the latter, set up more browsers would be nice to have the feature tested in all main browsers available.

- Upgrade dependencies versions. This way the project would be kept updated.

- More error handling and in-depth testing in general.

## Some considerations

- For the e2d tests I've used [Playwright](https://playwright.dev) by Microsoft. I know there are some alternatives out there, but since I've been using it lately (and it's quite good), I've opted for this solution.

- To set up the websocket link in the apollo client, I've had to use the old approach that it's not longer maintained (as stated [here](https://www.apollographql.com/docs/react/data/subscriptions/#websocket-subprotocols)). It looks like the server doesn't handle the requests correctly using the new approach suggested by the maintainers.
