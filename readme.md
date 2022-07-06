[![nps friendly](https://img.shields.io/badge/nps-friendly-brightgreen.svg?)](https://github.com/sezna/nps)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Azure2Jira

Azure2Jira adds links to Jira user stories from Azure UI

## Features

- options page to set jira base url
- notify users while they are browsing https://dev.azure.com/ pages and the extension is not setup
- transform jira-id texts to link to the jira user stories under
  `https://dev.azure.com/` pages
- currently, the following subpages are supported:
  - Repos/Commits page
  - Repos/files page
  - Repos/Pull requests page

## Developing

1. run `npm start watch` to watch for file changes and build continuously
1. open another terminal and run
   - `npm start firefox` for testing in firefox
   - `npm start chrome` for testing in chrome
   - `npm start test.watch.unit` for writing unit tests
   - `npm start test.watch.e2e` for writing e2e tests

## Install the extension to a browser

### Firefox

1. run `npm start zip.firefox` to create a zip file for the extension
2. load the extension manually from `./web-ext-artifacts` directory to
   [Firefox](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#mozilla-firefox)

### Chromium based browsers

1. run `npm start zip.chrome` to create a zip file for the extension
2. load the extension manually from `./web-ext-artifacts` directory to any
   [Chromium based browser](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#google-chrome-opera-vivaldi)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
