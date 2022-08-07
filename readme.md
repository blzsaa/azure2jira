[![nps friendly](https://img.shields.io/badge/nps-friendly-brightgreen.svg?)](https://github.com/sezna/nps)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Azure2Jira

Azure2Jira adds links to Jira user stories from Azure UI

## Install

<a href="https://addons.mozilla.org/en-US/firefox/addon/azure2jira/"><img width="64" alt="Firefox" src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg" /></a>
<a href="https://chrome.google.com/webstore/detail/azure2jira/jcodoifcdfgcgclpkepanjdffjkkcngk"><img width="64" alt="Chrome" src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg" /></a>

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

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
