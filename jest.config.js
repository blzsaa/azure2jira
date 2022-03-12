module.exports = {
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  moduleFileExtensions: ["ts", "js"],
  setupFilesAfterEnv: ["./tests/setupTests.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};
