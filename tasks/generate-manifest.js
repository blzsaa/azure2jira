const fs = require("fs");
const manifestJsonTemplate = require("../src/manifest_template.json");

const content = JSON.stringify(
  {
    version: process.env.npm_package_version,
    ...manifestJsonTemplate.common,
    ...manifestJsonTemplate[process.argv.slice(2)[0]],
  },
  null,
  2
);
fs.writeFileSync("src/manifest.json", content);
