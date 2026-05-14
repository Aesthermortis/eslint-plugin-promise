import allRules from "../../src/configs/all.js";
import rules from "../../src/rules/index.js";

it("enables all non-deprecated rules as errors", () => {
  expect(allRules).toStrictEqual(
    Object.fromEntries(
      Object.entries(rules)
        .filter(([, rule]) => !rule.meta?.deprecated)
        .map(([name]) => [`promise/${name}`, "error"]),
    ),
  );
});
