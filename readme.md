# Azure2Jira

Azure2Jira adds links to Jira user stories from Azure UI

## Features

- set jira base url at option page
- transform jira-id texts to link to the jira user stories under
  `https://dev.azure.com/` pages
- the following subpages are supported:
  - Repos/Commits page
  - Repos/files page
  - Repos/Pull requests page

### Run the extension

1. run `npm run watch` to watch for file changes and build continuously
1. in another terminal, run `npm run start:firefox` or `npm run start:chrome` for Firefox or Chrome

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
