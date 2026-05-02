// @ts-check

/** @type {import("jest").Config} */
const config = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  collectCoverageFrom: ["src/rules/*.js", "src/rules/*/*.js"],
  testPathIgnorePatterns: ["__tests__/rule-tester.js"],
};

export default config;
