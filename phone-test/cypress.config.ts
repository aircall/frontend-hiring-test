import { defineConfig } from "cypress";
import dotenv from 'dotenv';

const env_e2e = dotenv.config({ path: '.env.e2e' }).parsed;

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      config.env = {
        ...config.env,
        ...env_e2e,
    };

    return config;
    },
  },
});
