export function notifyUserAboutMissingConfig() {
  const div = document.createElement("div");
  div.id = "azure-2-jira-missing-config-message";
  div.style.position = "fixed";
  div.style.right = "0";
  div.style.bottom = "0";
  div.style.backgroundColor = "#f44336";
  div.style.padding = "20px";
  div.style.color = "white";
  div.style.zIndex = "99999";
  div.innerText =
    "The Azure2Jira extension is not set up! Please open options page of the extension!";
  document.body.appendChild(div);

  const span = document.createElement("span");
  span.innerText = "×";

  span.style.color = "white";
  span.style.marginLeft = "15px";
  span.style.fontWeight = "bold";
  span.style.float = "right";
  span.style.fontSize = "22px";
  span.style.lineHeight = "20px";
  span.style.cursor = "pointer";
  span.style.transition = "0.3s";
  div.appendChild(span);
  span.onclick = () => {
    div.removeChild(span);
    document.body.removeChild(div);
  };
}

export function linkifyJiraIssues(
  htmlElement: HTMLElement,
  parser: DOMParser,
  jiraBaseUrl: string
) {
  // Repos/Commits page
  [...htmlElement.getElementsByClassName("commit-title")].forEach((a) =>
    createLink(a as HTMLElement, parser, jiraBaseUrl)
  );

  // Repos/files page
  [...htmlElement.getElementsByClassName("repos-folder-list-comment")].forEach(
    (a) => createLink(a as HTMLElement, parser, jiraBaseUrl)
  );

  // Repos/Pull requests page
  [...htmlElement.querySelectorAll('[data-column-index="1"]')]
    .map((a) => a.querySelectorAll('[role="button"]')[0])
    .forEach((a) => createLink(a as HTMLElement, parser, jiraBaseUrl));
}

function createLink(div: HTMLElement, parser: DOMParser, jiraBaseUrl: string) {
  if (div) {
    const b = div.innerText;
    const newContent = b.replaceAll(
      /(.*?)([A-Z]+-\d+)(.*?)/g,
      `$1<a href="${jiraBaseUrl}/browse/$2">$2</a>$3` // $n -> nth regex group
    );
    div.replaceChildren(
      ...parser.parseFromString(newContent, "text/html").body.childNodes
    );
  }
}
