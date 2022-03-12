module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["package-scripts.js"] },
    ],
  },
  ignorePatterns: ["dist/*"],
};
