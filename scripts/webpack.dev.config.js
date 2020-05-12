/**
 * Configuration for Webpack watch
 *
 * Outputs generated files to ./build directory
 *
 * Does not generate a ServiceWorker
 */

const CopyPlugin = require("copy-webpack-plugin");
const paths = require("react-scripts/config/paths");

// override this so that the static paths resolve correctly
paths.publicUrlOrPath = "./";

const configFactory = require("react-scripts/config/webpack.config");

const config = configFactory(process.env.NODE_ENV || "development");
config.output.path = paths.appBuild;

config.plugins.push(
  new CopyPlugin(["public/maana.env.js", "public/manifest.json"])
);

config.stats = "minimal";

// Generate configuration
module.exports = config;
