import { Browser, Page } from "puppeteer";
import path from "path";

const puppeteer = require("puppeteer");
const nock = require("nock");
const useNock = require("nock-puppeteer");

describe("e2e test", () => {
  jest.setTimeout(60000);
  let page: Page, browser: Browser;

  describe("when extension is set up", () => {
    beforeAll(async () => {
      browser = await getBrowserWithExtension();
      await setUpExtension();
    });

    beforeEach(async () => {
      page = await browser.newPage();
    });

    afterEach(async () => {
      await page.close();
    });

    afterAll(async () => {
      await browser.close();
    });

    it("should create links for pages under dev.azure.com", async () => {
      mockDevAzureWebsite([
        '<div id="commit-page" class="commit-title">fix ASD-123</div>',
        '<div id="files-page" class="repos-folder-list-comment">jira IDS like ASD-124 should be recognized everywhere</div>',
        '<div data-column-index="1"><span id="pull-requests-page" role="button">ASD-125</span></div>',
        '<div id="wrong-class" class="not-commit-title not-repos-folder-list-comment">WRONG-123</div>',
        '<div data-column-index="1"><span id="wrong-role" role="alert">WRONG-123</span></div>',
        '<div data-column-index="0"><span id="wrong-index" role="button">WRONG-123</span></div>',
      ]);

      await page.goto("https://dev.azure.com/sub-page", {
        waitUntil: "domcontentloaded",
      });

      await page.waitForSelector("a");

      expect(await innerHtmlOf("#commit-page")).toBe(
        'fix <a href="https://asd.com/browse/ASD-123">ASD-123</a>'
      );
      expect(await innerHtmlOf("#files-page")).toBe(
        'jira IDS like <a href="https://asd.com/browse/ASD-124">ASD-124</a> should be recognized everywhere'
      );
      expect(await innerHtmlOf("#pull-requests-page")).toBe(
        '<a href="https://asd.com/browse/ASD-125">ASD-125</a>'
      );
      expect(await innerHtmlOf("#wrong-class")).toBe("WRONG-123");
      expect(await innerHtmlOf("#wrong-role")).toBe("WRONG-123");
      expect(await innerHtmlOf("#wrong-index")).toBe("WRONG-123");
    });
  });

  describe("when extension is not set up", () => {
    beforeAll(async () => {
      browser = await getBrowserWithExtension();
    });

    beforeEach(async () => {
      page = await browser.newPage();
    });

    afterEach(async () => {
      await page.close();
    });

    afterAll(async () => {
      await browser.close();
    });

    it("should notify user when they are in a dev.azure.com page", async function () {
      mockDevAzureWebsite([
        '<div id="commit-page" class="commit-title">fix ASD-123</div>',
      ]);

      await page.goto("https://dev.azure.com/sub-page", {
        waitUntil: "domcontentloaded",
      });

      await page.waitForSelector("#azure-2-jira-missing-config-message");
      expect(await innerHtmlOf("#commit-page")).toBe("fix ASD-123");
      expect(
        await innerHtmlOf("#azure-2-jira-missing-config-message")
      ).toContain(
        "The Azure2Jira extension is not set up! Please open settings page of the extension!"
      );
    });
  });

  async function getBrowserWithExtension() {
    const pathToExtension = path.join(__dirname, "..", "..", "dist");
    const puppeteerArgs = [
      "--no-sandbox",
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      "--show-component-extension-options",
    ];
    // Chrome Headless doesn't support extensions
    // https://github.com/puppeteer/puppeteer/issues/659#issuecomment-326754863
    return await puppeteer.launch({
      args: puppeteerArgs,
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      headless: false,
    });
  }

  async function innerHtmlOf(selector: string) {
    return await page.$eval(selector, (element) => element.innerHTML);
  }

  function getIdForAzure2JiraExtension() {
    const target = browser
      .targets()
      .find((t) => t.url().startsWith("chrome-extension"));
    if (!target) {
      fail("missing extension");
    }
    return target.url().split("/")[2];
  }

  async function setUpExtension() {
    const extensionId = getIdForAzure2JiraExtension();

    const page = await browser.newPage();
    const chromeExtPath = `chrome-extension://${extensionId}/options/options.html`;

    await page.goto(chromeExtPath, { waitUntil: "domcontentloaded" });

    await page.click("input");
    await page.keyboard.type("https://asd.com");
    await page.click("button");
    await page.close();
  }

  function mockDevAzureWebsite(content: string[]) {
    useNock(page, ["https://dev.azure.com"]);

    nock("https://dev.azure.com", { allowUnmocked: false })
      .get("/sub-page")
      .reply(
        200,
        `<html lang="en">
            <head><title>Mocked https://dev.azure.com Page</title></head>
            <body>
              Mocked https://dev.azure.com Page
              ${content.join("")}
            </body>
          </html>`,
        { "Content-Type": "text/html" }
      );
  }
});
