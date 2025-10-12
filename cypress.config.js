module.exports = {
  e2e: {
    async setupNodeEvents(on, config) {
      const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
      const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
      const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
    specPattern: "cypress/e2e/**/*.feature",
    baseUrl: "http://localhost:4173",
    projectId: "uhomii",
  },
};
