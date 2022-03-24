# Azure2Jira

Azure2Jira adds links to Jira user stories from Azure UI

## Features

- set jira base url at option page
- transform jira-id texts to link to the jira user stories under
  `https://dev.azure.com/` pages
- currently, the following subpages are supported:
  - Repos/Commits page
  - Repos/files page
  - Repos/Pull requests page

## Run the extension for developing purposes

1. run `npm run watch` to watch for file changes and build continuously
1. in another terminal, run `npm run start:firefox` or `npm run start:chrome` for Firefox or Chrome

## Install the extension

1. run `npm run build:zip`
2. load the extension manually from `./web-ext-artifacts` directory to
   [Chrome](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#google-chrome-opera-vivaldi)
   or [Firefox](https://www.smashingmagazine.com/2017/04/browser-extension-edge-chrome-firefox-opera-brave-vivaldi/#mozilla-firefox)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
