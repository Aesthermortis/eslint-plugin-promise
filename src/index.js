import packageJson from "../package.json" with { type: "json" };
import rules from "./rules/index.js";

const { name: packageName, version: packageVersion } = packageJson;
const namespace = "promise";

/** @type {import("eslint").Linter.RulesRecord} */
const recommendedRules = {
  "promise/always-return": "error",
  "promise/no-return-wrap": "error",
  "promise/param-names": "error",
  "promise/catch-or-return": "error",
  "promise/no-native": "off",
  "promise/no-nesting": "warn",
  "promise/no-promise-in-callback": "warn",
  "promise/no-callback-in-promise": "warn",
  "promise/avoid-new": "off",
  "promise/no-new-statics": "error",
  "promise/no-return-in-finally": "warn",
  "promise/valid-params": "warn",
};

/** @type {Record<string, import("eslint").Linter.Config>} */
const configs = {};

const plugin = {
  meta: {
    name: packageName,
    namespace,
    version: packageVersion,
  },
  configs,
  rules,
};

Object.assign(plugin.configs, {
  recommended: {
    name: `${namespace}/recommended`,
    plugins: { [namespace]: plugin },
    rules: recommendedRules,
  },
});

export default plugin;
