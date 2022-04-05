const { series } = require("nps-utils");

const generateManifest = 'node "tasks/generate-manifest.js"';

module.exports = {
  scripts: {
    test: {
      default: series("nps test.unit", "nps test.e2e"),
      unit: series(generateManifest, "jest --testPathPattern=tests/unit"),
      e2e: series("nps build", "jest --testPathPattern=tests/e2e"),
      watch: {
        unit: "jest --testPathPattern=tests/unit --watch",
        e2e: "jest --testPathPattern=tests/e2e --watch",
      },
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
    firefox: "web-ext run --browser-console",
    chrome: "web-ext run -t chromium --browser-console",
  },
};
