import "mockzilla-webextension";

interface CustomMatchers<R = unknown> {
  hasInnerText(expected: string | undefined): R;
  hasInnerHTML(expected: string): R;
}

declare global {
  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

expect.extend({
  hasInnerText(received: string, expected: string) {
    const htmlElement = document.querySelector<HTMLElement>(received);
    if (!htmlElement) {
      return {
        message: () =>
          `expected innerText of '${received}' to be '${expected}', but cannot find '${received}' in the document`,
        pass: false,
      };
    }
    if (htmlElement.innerText === expected) {
      return {
        message: () =>
          `expected '${received}' not to have innerText with content of '${expected}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected innerText of '${received}' to be '${expected}', but was '${htmlElement.innerText}'`,
        pass: false,
      };
    }
  },
  hasInnerHTML(received: string, expected: string) {
    const htmlElement = document.querySelector<HTMLElement>(received);
    if (!htmlElement) {
      return {
        message: () =>
          `expected innerHTML of '${received}' to be '${expected}', but cannot 
          find '${received}' in the document`,
        pass: false,
      };
    }
    if (htmlElement.innerHTML === expected) {
      return {
        message: () =>
          `expected '${received}' not to have innerHTML with content of '${expected}'`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected innerHTML of '${received}' to be '${expected}', but was '${htmlElement.innerHTML}'`,
        pass: false,
      };
    }
  },
});
