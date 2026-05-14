import packageJson from "../package.json" with { type: "json" };
import plugin from "../src/index.js";

const { name: packageName, version: packageVersion } = packageJson;

test("can import index file", () => {
  expect(plugin).toBeInstanceOf(Object);
});

test("default plugin exposes meta", () => {
  expect(plugin.meta).toEqual({
    name: packageName,
    namespace: "promise",
    version: packageVersion,
  });
});

test("default plugin exposes rule set", () => {
  expect(plugin.rules).toEqual(
    expect.objectContaining({
      "always-return": expect.any(Object),
    }),
  );
});

test("default plugin exposes recommended config", () => {
  expect(plugin.configs.recommended.name).toBe("promise/recommended");
  expect(plugin.configs.recommended.plugins.promise).toBe(plugin);
  expect(plugin.configs.recommended.rules).toEqual(
    expect.objectContaining({ "promise/always-return": "error" }),
  );
  expect(plugin.configs).not.toHaveProperty("flat/recommended");
});

test("module does not expose named configs or rules exports", async () => {
  const pluginModule = await import("../src/index.js");

  expect(pluginModule.default).toBe(plugin);
  expect(pluginModule).not.toHaveProperty("configs");
  expect(pluginModule).not.toHaveProperty("rules");
});
