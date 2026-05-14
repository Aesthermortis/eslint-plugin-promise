import { RuleTester } from "eslint";
import globals from "globals";

import rule from "../../src/rules/no-native.js";

const languageOptions = {
  ecmaVersion: 6,
  sourceType: "module",
};

const ruleTesters = [
  new RuleTester({
    languageOptions,
  }),
];

for (const ruleTester of ruleTesters) {
  ruleTester.run("no-native", rule, {
    valid: [
      'var Promise = null; function x() { return Promise.resolve("hi"); }',
      'var Promise = window.Promise || require("bluebird"); var x = Promise.reject();',
      'import Promise from "bluebird"; var x = Promise.reject();',
      {
        code: 'var Promise = null; Promise.resolve("hi");',
        languageOptions: {
          ecmaVersion: 6,
          sourceType: "script",
        },
      },
    ],

    invalid: [
      {
        code: "new Promise(function(reject, resolve) { })",
        errors: [{ message: '"Promise" is not defined.' }],
      },
      {
        code: "Promise.resolve()",
        errors: [{ message: '"Promise" is not defined.' }],
      },
      {
        code: "new Promise(function(reject, resolve) { })",
        errors: [{ message: '"Promise" is not defined.' }],
        languageOptions: {
          globals: { ...globals.browser },
        },
      },
      {
        code: "new Promise(function(reject, resolve) { })",
        errors: [{ message: '"Promise" is not defined.' }],
        languageOptions: {
          globals: { ...globals.node },
        },
      },
      {
        code: "Promise.resolve()",
        errors: [{ message: '"Promise" is not defined.' }],
        languageOptions: {
          globals: { ...globals.es2015 },
        },
      },
      {
        code: "Promise.resolve()",
        errors: [{ message: '"Promise" is not defined.' }],
        languageOptions: {
          globals: { Promise: "readonly" },
        },
      },
      {
        code: "Promise.resolve()",
        errors: [{ message: '"Promise" is not defined.' }],
        languageOptions: {
          globals: { Promise: "off" },
        },
      },
    ],
  });
}
