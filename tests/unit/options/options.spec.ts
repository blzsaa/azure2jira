import {
  createDummyJiraLinkFromInput,
  loadCurrentValues,
  saveOptions,
} from "@/options/options";

describe("Options", () => {
  beforeEach(() => {
    document.body.innerHTML =
      "<form>" +
      ' <input id="jiraBaseUrl" type="url">' +
      ' <div hidden id="success-message" class="alert-success center"/>' +
      "</form>" +
      '<a id="exampleJiraUrl"></a>';
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
    it("should create a link to jira from the value of input when it is valid", async () => {
      document.querySelector("input")!!.value = "https://asd.com/";
      createDummyJiraLinkFromInput();

      expect(document.querySelector("a")?.href).toBe(
        "https://asd.com/browse/ASD-123"
      );
    });
    it("should only create a link to jira when the input is valid", async () => {
      document.body.innerHTML =
        '<input id="jiraBaseUrl" value="asdcom" type="url">' +
        '<a id="exampleJiraUrl"></a>';

      createDummyJiraLinkFromInput();

      expect(document.querySelector("a")?.href).toBe("");
    });
  });

  describe("loadCurrentValues()", () => {
    describe("should read jiraBaseUrl from storage and put it into the input field ", () => {
      it("and link if it is a correct URL", async () => {
        mockBrowser.storage.sync.get
          .expect("jiraBaseUrl")
          .andResolve({ jiraBaseUrl: "https://asd.com/" });

        await loadCurrentValues();

        expect(
          document.querySelector<HTMLInputElement>("#jiraBaseUrl")?.value
        ).toBe("https://asd.com/");
        expect(document.querySelector<HTMLLinkElement>("a")?.innerText).toBe(
          "https://asd.com/browse/ASD-123"
        );
        expect(document.querySelector("a")?.href).toBe(
          "https://asd.com/browse/ASD-123"
        );
      });
      it("but don't make it a link if it is not a correct URL", async () => {
        mockBrowser.storage.sync.get
          .expect("jiraBaseUrl")
          .andResolve({ jiraBaseUrl: "notAnUrl/" });

        await loadCurrentValues();

        expect(
          document.querySelector<HTMLInputElement>("#jiraBaseUrl")?.value
        ).toBe("notAnUrl/");
        expect(document.querySelector<HTMLLinkElement>("a")?.innerText).toBe(
          "notAnUrl/browse/ASD-123"
        );
        expect(document.querySelector("a")?.href).toBe("");
      });
      it("or put empty string if nullish value comes back from storage", async () => {
        mockBrowser.storage.sync.get
          .expect("jiraBaseUrl")
          .andResolve({ jiraBaseUrl: undefined });
        await loadCurrentValues();

        expect(
          document.querySelector<HTMLInputElement>("#jiraBaseUrl")?.value
        ).toBe("");
        expect(document.querySelector<HTMLLinkElement>("a")?.innerText).toBe(
          undefined
        );
        expect(document.querySelector("a")?.href).toBe("");
      });
    });
  });
});
