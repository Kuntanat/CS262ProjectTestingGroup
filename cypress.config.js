const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
  baseUrl: "https://cs262-tu-restauranthelper-bqa4f9dva8b7g7bk.southeastasia-01.azurewebsites.net/",
	specPattern: [
	      'cypress/e2e/**/*.cy.js',
	      'cypress/FunctionalTesting/**/*.cy.js'
	    ],
  supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
    },
  },
});