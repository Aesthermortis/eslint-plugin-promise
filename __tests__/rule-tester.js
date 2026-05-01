/**
 * @file Helpers for tests.
 * @author 唯然<weiran.zsd@outlook.com>
 */

import { createRequire } from "node:module";

import { RuleTester as ESLintRuleTester } from "eslint";
import globals from "globals";

const require = createRequire(import.meta.url);
const { version } = require("eslint/package.json");

const majorVersion = Number.parseInt(version.split(".")[0], 10);

/**
 * Merge enabled env globals into the flat-config language options.
 *
 * @param {Record<string, unknown>} config - RuleTester config object.
 * @returns {void}
 */
function applyEnvGlobals(config) {
  if (config.env instanceof Object === false) {
    return;
  }

  if (config.languageOptions.globals == null) {
    config.languageOptions.globals = {};
  }

  for (const key in config.env) {
    if (Object.hasOwn(globals, key)) {
      const envGlobals = Reflect.get(globals, key);
      if (envGlobals instanceof Object) {
        Object.assign(config.languageOptions.globals, envGlobals);
      }
    }
  }

  delete config.env;
}

/**
 * Convert legacy RuleTester config fields to ESLint v9+ flat config equivalents.
 *
 * @param {Record<string, unknown>} config - RuleTester config object.
 * @returns {Record<string, unknown>} The converted config object.
 */
function convertConfig(config) {
  if (config instanceof Object === false) {
    return config;
  }

  if (config.languageOptions == null) {
    config.languageOptions = {};
  }

  if (config.parserOptions) {
    Object.assign(config.languageOptions, config.parserOptions);
    delete config.parserOptions;
  }

  if (typeof config.parser === "string") {
    // eslint-disable-next-line security/detect-non-literal-require -- parser name comes from local test configuration.
    config.languageOptions.parser = require(config.parser);
    delete config.parser;
  }

  if (config.globals instanceof Object) {
    config.languageOptions.globals = config.globals;
    delete config.globals;
  }

  applyEnvGlobals(config);

  delete config.parserOptions;
  delete config.parser;

  return config;
}

/**
 * Create a RuleTester compatible with both ESLint v8 and v9+ test case formats.
 *
 * @param {Record<string, unknown>} [config] - RuleTester constructor config. Defaults to an empty object.
 * @returns {ESLintRuleTester} A configured RuleTester instance.
 */
export function RuleTester(config = {}) {
  if (majorVersion <= 8) {
    return new ESLintRuleTester(config);
  }

  const ruleTester = new ESLintRuleTester(convertConfig(config));
  const run = ruleTester.run.bind(ruleTester);
  ruleTester.run = function (name, rule, tests) {
    tests.valid = tests.valid.map((testCase) => convertConfig(testCase));
    tests.invalid = tests.invalid.map((testCase) => convertConfig(testCase));

    run(name, rule, tests);
  };
  return ruleTester;
}
