

# 1.0.0 (2022-06-30)


### Bug Fixes

* **linking:** prevent linkifying cases where jira IDs are not separate words ([8f08975](https://github.com/blzsaa/azure2jira/commit/8f0897509afd11a095af941e0ed1818d5ca8cc12))
* **watch:** make `npm start watch` command watch for changes in manifest_template.json file as well ([c7d6736](https://github.com/blzsaa/azure2jira/commit/c7d6736cd28be7c20bd56336ea155d330a1e2d16)), closes [#10](https://github.com/blzsaa/azure2jira/issues/10)


### Features

* create basic functionalities of azure to jira extension with CI ([a671118](https://github.com/blzsaa/azure2jira/commit/a6711184cc1e932f77dad59fb947c1a0950e4071))
* make extension to work after navigating to a different subpage ([5aeff92](https://github.com/blzsaa/azure2jira/commit/5aeff929c1c38a7202d240c8bf4e7ec85dcedf62)), closes [#7](https://github.com/blzsaa/azure2jira/issues/7)
* **options:** auto reload open dev.azure.com/* tabs after saving new jiraBaseUrl at options page ([926d1ba](https://github.com/blzsaa/azure2jira/commit/926d1ba4594e2093b41cdbcaca56aee6548673c2)), closes [#8](https://github.com/blzsaa/azure2jira/issues/8)
* update manifest.json with correct homepage_url and browser_specific_settings.gecko.id ([5d61e36](https://github.com/blzsaa/azure2jira/commit/5d61e36e4d53cec6237921e51bdaf19d77666143)), closes [#9](https://github.com/blzsaa/azure2jira/issues/9)


### Reverts

* **linking:** revert preventing linkifying cases where jira IDs are not separate words ([612bd2e](https://github.com/blzsaa/azure2jira/commit/612bd2ebaacdb8055c223034e525e8792e5ced56))
