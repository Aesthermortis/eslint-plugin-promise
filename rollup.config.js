import { nodeResolve } from "@rollup/plugin-node-resolve";
import dtsBundle from "rollup-plugin-dts";

export default [
  {
    external: ["@eslint-community/eslint-utils"],
    input: "index.js",
    output: {
      file: "dist/index.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [nodeResolve()],
  },
  {
    input: "types/index.d.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dtsBundle()],
  },
];
