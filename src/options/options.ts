import browser, { Tabs } from "webextension-polyfill";

export async function saveOptions(e: Event) {
  e.preventDefault();
  const jiraBaseUrl =
    document.querySelector<HTMLInputElement>("#jiraBaseUrl")!!.value;
  await browser.storage.sync.set({
    jiraBaseUrl: jiraBaseUrl,
  });
  const successMessageDiv =
    document.querySelector<HTMLDivElement>("#success-message");
  if (successMessageDiv) {
    successMessageDiv.removeAttribute("hidden");
    successMessageDiv.innerText = `Saved ${jiraBaseUrl}`;
    await refreshAzureDevopsTabs();
  }
}

async function refreshAzureDevopsTabs() {
  const tabs = await browser.tabs.query({ url: "https://dev.azure.com/*" });
  tabs
    .map((tab: Tabs.Tab) => tab.id)
    .forEach((id: number | undefined) => browser.tabs.reload(id));
}

export function createDummyJiraLinkFromInput() {
  const jiraBaseUrl =
    document.querySelector<HTMLInputElement>("#jiraBaseUrl")!.value ||
    document.querySelector<HTMLInputElement>("#jiraBaseUrl")!.placeholder;
  const dummyId =
    document.querySelector<HTMLInputElement>("#dummy-jira-id")!.value ||
    document.querySelector<HTMLInputElement>("#dummy-jira-id")!.placeholder;
  const jiraLink = `${jiraBaseUrl}/browse/${dummyId}`;
  const example = document.querySelector<HTMLLinkElement>("#exampleJiraUrl")!;
  example.innerText = jiraLink;
  example.href = jiraLink;
}

export async function loadCurrentValues() {
  const { jiraBaseUrl } = await browser.storage.sync.get("jiraBaseUrl");
  if (jiraBaseUrl) {
    document.querySelector<HTMLInputElement>("#jiraBaseUrl")!!.value =
      jiraBaseUrl;
  }
  createDummyJiraLinkFromInput();
}

document.addEventListener("DOMContentLoaded", loadCurrentValues);
document
  .querySelector<HTMLFormElement>("form")
  ?.addEventListener("submit", saveOptions);

document
  .querySelectorAll<HTMLInputElement>("input")
  .forEach((el) => el.addEventListener("input", createDummyJiraLinkFromInput));
