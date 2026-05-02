import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  external: ["@eslint-community/eslint-utils", "../package.json"],
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "es",
    importAttributesKey: "with",
    sourcemap: true,
  },
  plugins: [nodeResolve()],
};
