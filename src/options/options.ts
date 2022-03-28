import browser from "webextension-polyfill";

export async function saveOptions(e: Event) {
  e.preventDefault();
  const valueFromInput =
    document.querySelector<HTMLInputElement>("#jiraBaseUrl")!!.value;
  const jiraBaseUrl = valueFromInput.endsWith("/")
    ? valueFromInput
    : `${valueFromInput}/`;
  await browser.storage.sync.set({
    jiraBaseUrl: jiraBaseUrl,
  });
  const successMessageDiv =
    document.querySelector<HTMLDivElement>("#success-message");
  if (successMessageDiv) {
    successMessageDiv.removeAttribute("hidden");
    successMessageDiv.innerText = `Saved ${jiraBaseUrl}`;
  }
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
