import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "vq61f6",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000"
  }
});
