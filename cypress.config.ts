import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      on('task', {
        // Add any custom tasks here
        log(message: string) {
          console.log(message);
          return null;
        },
      });
    },
  },
  env: {
    // Add any environment variables here
  },
  video: false, // Set to true if you want to record videos
  screenshotOnRunFailure: true,
});