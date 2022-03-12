const fs = require("fs");
const manifestJsonTemplate = require("../src/manifest_template.json");

const content = JSON.stringify(
  {
    ...manifestJsonTemplate,
    version: process.env.npm_package_version,
  },
  null,
  2
);
fs.writeFileSync("src/manifest.json", content);
