import browser from "webextension-polyfill";

browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});
