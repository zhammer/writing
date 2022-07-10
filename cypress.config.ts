import { defineConfig } from "cypress";
import webpack from "@cypress/webpack-preprocessor";
import pkg from '@badeball/cypress-cucumber-preprocessor'
const { addCucumberPreprocessorPlugin } = pkg;

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    webpack({
      webpackOptions: {
        resolve: {
          extensions: [".ts", ".js"],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}


export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    projectId: "uhomii",
    specPattern: "**/*.feature",
    supportFile: false,
    setupNodeEvents
  }
})