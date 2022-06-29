import {
  linkifyJiraIssues,
  notifyUserAboutMissingConfig,
} from "@/linkify-actor";

describe("linkify-actor", () => {
  afterEach(() => {
    jest.resetModules();
    document.getElementsByTagName("html")[0].innerHTML = "";
  });

  describe("notifyUserAboutMissingConfig", () => {
    it("should add notification message to the website", async () => {
      notifyUserAboutMissingConfig();

      expect("#azure-2-jira-missing-config-message").hasInnerText(
        "The Azure2Jira extension is not set up! Please open options page of the extension!"
      );
    });
  });
  describe("linkifyJiraIssues", () => {
    describe("should transform simple jira IDs to links", () => {
      const expected = expectedJiraIdAsLink("ASD-123");

      it("from repos/commit page, where the class name is `commit-title'", async () => {
        createElement("div", {
          class: ["commit-title"],
          innerText: "ASD-123",
          under: document.body,
        });
        createElement("div", {
          class: ["not-commit-title"],
          innerText: "ASD-123",
          under: document.body,
        });

        runLinkifyJiraIssues();

        expect(".commit-title").hasInnerHTML(expected);
        expect(".not-commit-title").not.hasInnerHTML(expected);
      });
      it("from repos/files page, where the class name is `repos-folder-list-comment'", async () => {
        createElement("div", {
          class: ["repos-folder-list-comment"],
          innerText: "ASD-123",
          under: document.body,
        });
        createElement("div", {
          class: ["not-repos-folder-list-comment"],
          innerText: "ASD-123",
          under: document.body,
        });

        runLinkifyJiraIssues();

        expect(".repos-folder-list-comment").hasInnerHTML(expected);
        expect(".not-repos-folder-list-comment").not.hasInnerHTML(expected);
      });
      it("from repos/Pull requests page, where the data-column-index=1 and role=button", async () => {
        const div = createElement("div", {
          dataSet: { columnIndex: "1" },
          under: document.body,
        });
        const div2 = createElement("div", {
          dataSet: { columnIndex: "2" },
          under: document.body,
        });
        createElement("div", {
          id: "divWithRoleUnderColumnIndex1",
          attributes: { role: "button" },
          innerText: "ASD-123",
          under: div,
        });
        createElement("div", {
          id: "divWithRoleUnderColumnIndex2",
          attributes: { role: "button" },
          innerText: "ASD-123",
          under: div2,
        });
        createElement("div", {
          id: "divWithWrongRoleUnderColumnIndex1",
          attributes: { role: "not-button" },
          innerText: "ASD-123",
          under: div,
        });

        runLinkifyJiraIssues();

        expect("#divWithRoleUnderColumnIndex1").hasInnerHTML(expected);
        expect("#divWithRoleUnderColumnIndex2").not.hasInnerHTML(expected);
        expect("#divWithWrongRoleUnderColumnIndex1").not.hasInnerHTML(expected);
      });
    });
    describe("when processing possible jira IDs", () => {
      it("should find jira ID even when it is not first part of the description", async () => {
        await shouldParseTheFollowingAsJiraId("abc ASD-123 abc");
      });
      it("should find jira ID even when written together with other words", async () => {
        await shouldParseTheFollowingAsJiraId("messageASD-123:");
      });
      it("should find jira ID even when written together with emojies", async () => {
        await shouldParseTheFollowingAsJiraId("🚀ASD-123🚀");
      });
      it("should find multiple jira IDs", async () => {
        createElement("div", {
          class: ["commit-title"],
          innerText: "abc ASD-123 abc ASD-124 abc \nQWE-111\n",
          under: document.body,
        });

        runLinkifyJiraIssues();

        expect(".commit-title").hasInnerHTML(
          "abc " +
            expectedJiraIdAsLink("ASD-123") +
            " abc " +
            expectedJiraIdAsLink("ASD-124") +
            " abc \n" +
            expectedJiraIdAsLink("QWE-111") +
            "\n"
        );
      });
    });
    describe("should only linkify jira IDs", () => {
      it("should ignore lowercase fake jira IDs", async () => {
        await shouldNotParseTheFollowingAsJiraId("asd-123");
      });
      it("should ignore jira IDs without dash sign", async () => {
        await shouldNotParseTheFollowingAsJiraId("ASD123");
      });
    });
  });
});

function createElement(
  tagName: string,
  options?: {
    id?: string;
    dataSet?: Record<string, string>;
    attributes?: Record<string, string>;
    innerText?: string;
    under?: HTMLElement;
    class?: [string];
  }
) {
  const element = document.createElement("div");
  if (!options) {
    return element;
  }
  if (options.id) {
    element.id = options.id;
  }
  if (options.class) {
    options.class.forEach((c) => element.classList.add(c));
  }
  if (options.under) {
    options.under.appendChild(element);
  }
  if (options.innerText) {
    element.innerText = options.innerText;
  }
  if (options.dataSet) {
    Object.keys(options.dataSet).forEach((a) => {
      element.dataset[a] = options.dataSet!![a];
    });
  }
  if (options.attributes) {
    Object.keys(options.attributes).forEach((a) => {
      element.setAttribute(a, options.attributes!![a]);
    });
  }
  return element;
}
function expectedJiraIdAsLink(expectedJiraId: string) {
  return `<a href="https://jiraUrl.org/browse/${expectedJiraId}">${expectedJiraId}</a>`;
}

async function shouldParseTheFollowingAsJiraId(content: string) {
  const asd = content.split("ASD-123");
  createElement("div", {
    class: ["commit-title"],
    innerText: content,
    under: document.body,
  });

  runLinkifyJiraIssues();

  expect(".commit-title").hasInnerHTML(
    asd[0] + expectedJiraIdAsLink("ASD-123") + asd[1]
  );
}

async function shouldNotParseTheFollowingAsJiraId(wrongContent: string) {
  createElement("div", {
    class: ["commit-title"],
    innerText: wrongContent,
    under: document.body,
  });

  runLinkifyJiraIssues();

  expect(".commit-title").hasInnerHTML(wrongContent);
}

function runLinkifyJiraIssues() {
  linkifyJiraIssues(document.body, new DOMParser(), "https://jiraUrl.org");
}
