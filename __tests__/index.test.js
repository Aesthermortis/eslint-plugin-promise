import plugin from "../src/index.js";
import allRules from "../src/configs/all.js";
import recommendedRules from "../src/configs/recommended.js";

const { configs, rules } = plugin;
const expectedRuleTypes = new Map([
  ["always-return", "problem"],
  ["avoid-new", "suggestion"],
  ["catch-or-return", "problem"],
  ["no-callback-in-promise", "suggestion"],
  ["no-multiple-resolved", "problem"],
  ["no-native", "suggestion"],
  ["no-nesting", "suggestion"],
  ["no-new-statics", "problem"],
  ["no-promise-in-callback", "suggestion"],
  ["no-return-in-finally", "problem"],
  ["no-return-wrap", "suggestion"],
  ["param-names", "suggestion"],
  ["prefer-await-to-callbacks", "suggestion"],
  ["prefer-await-to-then", "suggestion"],
  ["prefer-catch", "suggestion"],
  ["spec-only", "problem"],
  ["valid-params", "problem"],
]);

it("includes the configs and rules on the plugin", () => {
  expect(plugin.configs).toBe(configs);
  expect(plugin.rules).toBe(rules);
});

it("only exposes a default export from the root entrypoint", async () => {
  const moduleExports = await import("../src/index.js");

  expect(Object.keys(moduleExports)).toStrictEqual(["default"]);
});

it("includes the expected plugin metadata", () => {
  expect(plugin.meta).toMatchObject({
    name: "eslint-plugin-promise",
    namespace: "promise",
  });
  expect(plugin.meta.version).not.toBe("");
});

it("should have all the rules", () => {
  expect(Object.keys(rules).toSorted((a, b) => a.localeCompare(b))).toStrictEqual(
    [...expectedRuleTypes.keys()].toSorted((a, b) => a.localeCompare(b)),
  );
});

it.each(Object.entries(rules))("%s should export required fields", (name, rule) => {
  expect(rule).toHaveProperty("meta");
  expect(rule).toHaveProperty("create", expect.any(Function));
  expect(rule.meta.type).toBe(expectedRuleTypes.get(name));
  expect(rule.meta).toHaveProperty("schema");
  expect(rule.meta.schema).not.toBe(false);
  expect(["array", "object"]).toContain(
    Array.isArray(rule.meta.schema) ? "array" : typeof rule.meta.schema,
  );
  expect(rule.meta.docs.url).not.toBe("");
  expect(rule.meta.docs.description).not.toBe("");
});

it("has the expected recommended config", () => {
  expect(configs.recommended.name).toBe("promise/recommended");
  expect(configs.recommended.plugins["promise"]).toBe(plugin);
  expect(configs.recommended.rules).toBe(recommendedRules);
});

it("has the expected all config", () => {
  expect(configs.all.name).toBe("promise/all");
  expect(configs.all.plugins["promise"]).toBe(plugin);
  expect(configs.all.rules).toBe(allRules);
});
