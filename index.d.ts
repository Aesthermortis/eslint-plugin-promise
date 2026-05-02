import type { Linter, Rule } from "eslint";

declare const promisePlugin: {
  meta: {
    name: "eslint-plugin-promise";
    namespace: "promise";
    version: string;
  };
  configs: {
    recommended: Linter.Config & {
      name: "promise/recommended";
    };
  };
  rules: Record<string, Rule.RuleModule>;
};

export type PromisePlugin = typeof promisePlugin;
export default promisePlugin;
