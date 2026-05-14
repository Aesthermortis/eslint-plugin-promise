import rules from "../rules/index.js";

const namespace = "promise";

/** @type {import("eslint").Linter.RulesRecord} */
const allRules = Object.fromEntries(
  Object.entries(rules)
    .filter(([, rule]) => !rule.meta?.deprecated)
    .map(([name]) => [`${namespace}/${name}`, "error"]),
);

export default allRules;
