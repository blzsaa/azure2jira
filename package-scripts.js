const { series } = require("nps-utils");

const generateManifest = 'node "tasks/generate-manifest.js"';

module.exports = {
  scripts: {
    test: {
      default: series(generateManifest, "jest"),
      watch: series(generateManifest, "jest --watch"),
    },
    lint: {
      webExt: series("nps build", "web-ext lint --warnings-as-errors"),
      check: series("nps lint.webExt", "eslint .", "prettier --check ."),
      fix: series("eslint . --fix", " prettier --write ."),
    },
    build: {
      default: series(
        generateManifest,
        "parcel build src/manifest.json --no-content-hash --no-source-maps " +
          "--dist-dir dist --no-cache --detailed-report 0"
      ),
      zip: series(generateManifest, "web-ext build --overwrite-dest"),
    },
    watch: series(
      generateManifest,
      "parcel watch src/manifest.json --dist-dir dist --no-cache --no-hmr"
    ),
    start: {
      firefox: "web-ext run --browser-console",
      chromium: "web-ext run -t chromium --browser-console",
    },
  },
};
