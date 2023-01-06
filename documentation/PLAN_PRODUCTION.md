# Plan to be released into production

- Create a release note with the new features implemented from the backlog on this sprint.
- Create a continuous integration server to automate the integration of code changes from multiple contributors into a single software project.
- Testing of the new release with the others contributors features. It could be using Jenkins for instance.
- Create the migration sql scripts (backend) of the DB.
- Create a UAT server and deploy the new release (UAT server must be a mirrow of the production server) this testing is important because is the last 
  testing using the same environment of production, some issues could be detected in this environment where is not detected or reproduced in local env.
  It is recommended to use an updated production DB clone, for testing with production data.
- Run the migration scripts on the UAT DB server before testing.
- If testing of stage or uat server is correct deploy the solution on production and run the script.
- If any issue appears on any step, fix it and repeat all steps again.


# Known issues (backend and @aircall/tractor)

- there is a type on the Graphql_api.md, section subscription instead of onUpdateCall should be onUpdatedCall.
- The api doesn't support server side filtering or sorting, so I had to implement both on client side but this is not correct:
- - Sorting on created_at before grouping per date is required but sorting on client side doesn't mean I am grouping the whole calls of given date.
- - filtering on client side reduce the pagination size but doesn't include more calls on server side that probably can appears on the list
    without changing pagination.
- graphql-ws is not supported on server side forcing me to use subscriptions-transport-ws which is deprecated.
- MenuItem looks to be broken on @aircall/tractor library so I created my own component and not reused it
- dark mode looks to be not working correctly on @aircall/tractor modal