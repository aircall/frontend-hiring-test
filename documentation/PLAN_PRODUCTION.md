# Plan to be released into production

- Create a continuous integration server to automate the integration of code changes from multiple contributors into a single software project.
- Testing of the new release with the others contributors features.
- Create the migration sql scripts (backend)
- Create a UAT server and deploy the new release (UAT server must be a mirrow of the production server) this testing is important because is the last 
testing using the same environment of production, some issues could be detected in this new environment where is not detected in local env.
- Run the migration scripts on the UAT DB server.
- If testing of stage server is correct deploy the solution on production and run the script.
- If any issue appears on any step, fix it and repeat all steps again.

