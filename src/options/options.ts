import browser, { Tabs } from "webextension-polyfill";
import Tab = Tabs.Tab;

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
    .map((tab: Tab) => tab.id)
    .forEach((id: number | undefined) => browser.tabs.reload(id));
}

export function createDummyJiraLinkFromInput() {
  const jiraBaseUrl =
    document.querySelector<HTMLInputElement>("#jiraBaseUrl")?.value;
  const example = document.querySelector<HTMLLinkElement>("#exampleJiraUrl");
  if (example && jiraBaseUrl) {
    const jiraLink = `${jiraBaseUrl}browse/ASD-123`;
    example.innerText = jiraLink;
    if (
      document.querySelector<HTMLInputElement>("#jiraBaseUrl")?.checkValidity()
    ) {
      example.href = jiraLink;
    } else {
      example.removeAttribute("href");
    }
  }
}

export async function loadCurrentValues() {
  const { jiraBaseUrl } = await browser.storage.sync.get("jiraBaseUrl");
  document.querySelector<HTMLInputElement>("#jiraBaseUrl")!!.value =
    jiraBaseUrl || "";
  createDummyJiraLinkFromInput();
}

document.addEventListener("DOMContentLoaded", loadCurrentValues);
document
  .querySelector<HTMLFormElement>("form")
  ?.addEventListener("submit", saveOptions);

document
  .querySelector<HTMLInputElement>("#jiraBaseUrl")
  ?.addEventListener("input", createDummyJiraLinkFromInput);
