const { series } = require("nps-utils");

const generateManifest = 'node "tasks/generate-manifest.js"';

module.exports = {
  scripts: {
    clean: "rimraf dist",
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
        "nps clean",
        generateManifest,
        "parcel build src/manifest.json --no-content-hash --no-source-maps " +
          "--dist-dir dist --no-cache --detailed-report 0"
      ),
      zip: series("nps build", "web-ext build --overwrite-dest"),
    },
    watch: {
      default:
        "nodemon --watch src/manifest_template.json --exec npm run start watch._watch",
      _watch: series(
        "nps clean",
        generateManifest,
        "parcel watch src/manifest.json --dist-dir dist --no-cache --no-content-hash --no-hmr"
      ),
    },
    firefox: "web-ext run --browser-console",
    chrome: "web-ext run -t chromium --browser-console",
  },
};
