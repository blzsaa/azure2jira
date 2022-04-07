import browser from "webextension-polyfill";
import {
  linkifyJiraIssues,
  notifyUserAboutMissingConfig,
} from "./linkify-actor";

browser.storage.sync.get("jiraBaseUrl").then((storageItem) => {
  const jiraBaseUrl = storageItem.jiraBaseUrl;
  const parser = new DOMParser();
  if (!jiraBaseUrl) {
    notifyUserAboutMissingConfig();
    return;
  }

  linkifyJiraIssues(document.body, parser, jiraBaseUrl);

  const observer = new MutationObserver(async (list) => {
    list
      .filter((l: MutationRecord) => l.addedNodes)
      .map((l: MutationRecord) => l.addedNodes)
      .flatMap((l: NodeList) => [...l.values()])
      .filter((node) => node instanceof HTMLElement)
      .forEach((node) =>
        linkifyJiraIssues(node as HTMLElement, parser, jiraBaseUrl)
      );
  });
  observer.observe(document.body, {
    attributes: false,
    childList: true,
    subtree: true,
  });
});
