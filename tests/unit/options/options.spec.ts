import {
  createDummyJiraLinkFromInput,
  loadCurrentValues,
  saveOptions,
} from "@/options/options";
import * as fs from "fs";

describe("Options", () => {
  beforeEach(() => {
    document.body.innerHTML = fs.readFileSync(
      "./src/options/options.html",
      "utf8"
    );
  });

  describe("saveOptions()", () => {
    it("should save it to storage and notify user about successful saving", async () => {
      const tabs: any[] = [{ id: 1 }, { id: 3 }];
      mockBrowser.tabs.query
        .expect({ url: "https://dev.azure.com/*" })
        .andResolve(tabs);
      document.querySelector("input")!!.value = "aaaaa";
      mockBrowser.storage.sync.set.expect({ jiraBaseUrl: "aaaaa" });
      mockBrowser.tabs.reload.expect(1);
      mockBrowser.tabs.reload.expect(3);

      await saveOptions(new Event("does not matter"));

      expect(document.body.innerHTML).not.toContain("hidden");
    });
  });

  describe("createDummyJiraLinkFromInput()", () => {
    describe("when jiraBaseUrl and dummy-jira-id is empty", () => {
      it("should use placeholder values to create the link", () => {
        createDummyJiraLinkFromInput();

        expectLinkToBe("https://dummy-project.atlassian.net/browse/DUMMY-123");
      });
    });
    describe("when jiraBaseUrl is filled but dummy-jira-id is empty", () => {
      it("should use value from jiraBaseUrl and placeholder value for jira-id to create the link", () => {
        document.querySelector<HTMLInputElement>("#jiraBaseUrl")!!.value =
          "https://asd.com";

        createDummyJiraLinkFromInput();

        expectLinkToBe("https://asd.com/browse/DUMMY-123");
      });
    });
    describe("when jiraBaseUrl is empty but dummy-jira-id is filled", () => {
      it("should use value from jiraBaseUrl and placeholder value for jira-id to create the link", () => {
        document.querySelector<HTMLInputElement>("#dummy-jira-id")!!.value =
          "ASD-123";

        createDummyJiraLinkFromInput();

        expectLinkToBe("https://dummy-project.atlassian.net/browse/ASD-123");
      });
    });
    describe("when jiraBaseUrl and dummy-jira-id is filled", () => {
      it("should use values from them", () => {
        document.querySelector<HTMLInputElement>("#jiraBaseUrl")!!.value =
          "https://asd.com";
        document.querySelector<HTMLInputElement>("#dummy-jira-id")!!.value =
          "ASD-123";

        createDummyJiraLinkFromInput();

        expectLinkToBe("https://asd.com/browse/ASD-123");
      });
    });
  });

  describe("loadCurrentValues()", () => {
    describe("when reading jiraBaseUrl from storage", () => {
      describe("and jiraBaseUrl is already filled", () => {
        it("should put the value in the input and create link based on it", async () => {
          mockBrowser.storage.sync.get
            .expect("jiraBaseUrl")
            .andResolve({ jiraBaseUrl: "https://asd.com" });

          await loadCurrentValues();

          expect(
            document.querySelector<HTMLInputElement>("#jiraBaseUrl")?.value
          ).toBe("https://asd.com");
          expect(document.querySelector<HTMLLinkElement>("a")?.innerText).toBe(
            "https://asd.com/browse/DUMMY-123"
          );
          expect(document.querySelector("a")?.href).toBe(
            "https://asd.com/browse/DUMMY-123"
          );
        });
      });
      describe("and jiraBaseUrl is undefined", () => {
        it("should leave input empty and make link with the placeholder", async () => {
          mockBrowser.storage.sync.get
            .expect("jiraBaseUrl")
            .andResolve({ jiraBaseUrl: undefined });
          await loadCurrentValues();

          expect(
            document.querySelector<HTMLInputElement>("#jiraBaseUrl")?.value
          ).toBe("");
          expect(document.querySelector<HTMLLinkElement>("a")?.innerText).toBe(
            "https://dummy-project.atlassian.net/browse/DUMMY-123"
          );
          expect(document.querySelector("a")?.href).toBe(
            "https://dummy-project.atlassian.net/browse/DUMMY-123"
          );
        });
      });
    });
  });

  function expectLinkToBe(comBrowseDUMMY123: string) {
    expect(document.querySelector("a")?.href).toBe(comBrowseDUMMY123);
    expect(document.querySelector<HTMLLinkElement>("a")?.innerText).toBe(
      comBrowseDUMMY123
    );
  }
});
