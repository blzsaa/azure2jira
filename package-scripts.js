const { series } = require("nps-utils");

const generateV2Manifest = 'node "tasks/generate-manifest.js" v2';
const generateV3Manifest = 'node "tasks/generate-manifest.js" v3';

module.exports = {
  scripts: {
    clean: "rimraf dist",
    test: {
      default: series("nps test.unit", "nps test.e2e"),
      unit: series(generateV2Manifest, "jest --testPathPattern=tests/unit"),
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
      default: "nps build.firefox",
      firefox: series(
        "nps clean",
        generateV2Manifest,
        "parcel build src/manifest.json --no-content-hash --no-source-maps " +
          "--dist-dir dist --no-cache --detailed-report 0"
      ),
      chrome: series(
        "nps clean",
        generateV3Manifest,
        "parcel build src/manifest.json --no-content-hash --no-source-maps " +
          "--dist-dir dist --no-cache --detailed-report 0"
      ),
    },
    zip: {
      default: series("nps zip.firefox", "nps zip.chrome"),
      firefox: series(
        "nps build.firefox",
        "web-ext build --overwrite-dest " +
          `--filename azure2jira-firefox-${process.env.npm_package_version}.zip`
      ),
      chrome: series(
        "nps build.chrome",
        "web-ext build --overwrite-dest " +
          `--filename azure2jira-chrome-${process.env.npm_package_version}.zip`
      ),
    },
    watch: {
      default: "nps watch.v2",
      v2: {
        default:
          "nodemon --watch src/manifest_template.json --exec npm run start watch.v2._watch",
        _watch: series(
          "nps clean",
          generateV2Manifest,
          "parcel watch src/manifest.json --dist-dir dist --no-cache --no-content-hash --no-hmr"
        ),
      },
      v3: {
        default:
          "nodemon --watch src/manifest_template.json --exec npm run start watch.v3._watch",
        _watch: series(
          "nps clean",
          generateV3Manifest,
          "parcel watch src/manifest.json --dist-dir dist --no-cache --no-content-hash --no-hmr"
        ),
      },
    },
    firefox: "web-ext run --browser-console",
    chrome: "web-ext run -t chromium --browser-console",
  },
};
