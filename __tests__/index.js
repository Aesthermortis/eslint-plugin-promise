import plugin, { configs } from "../index.js";

test("can import index file", () => {
  expect(plugin).toBeInstanceOf(Object);
});

test("rule set", () => {
  expect(configs.recommended.name).toBe("promise/recommended");
  expect(configs.recommended.plugins.promise).toBe(plugin);
  expect(configs.recommended.rules).toEqual(
    expect.objectContaining({ "promise/always-return": "error" }),
  );
  expect(configs["flat/recommended"]).toBeUndefined();
});
