import type { Linter, Rule } from "eslint";

export type PromiseRuleDocs = {
  description: string;
  url: string;
};

export type PromiseRuleMeta = Omit<Rule.RuleMetaData, "docs"> & {
  docs: PromiseRuleDocs;
  schema: Rule.RuleMetaData["schema"];
  type: NonNullable<Rule.RuleMetaData["type"]>;
};

export type PromiseRuleModule = Omit<Rule.RuleModule, "meta"> & {
  meta: PromiseRuleMeta;
};

declare const promisePlugin: {
  meta: {
    name: "eslint-plugin-promise";
    namespace: "promise";
    version: string;
  };

  configs: {
    all: Linter.Config & {
      name: "promise/all";
      plugins: {
        promise: typeof promisePlugin;
      };
      rules: Linter.RulesRecord;
    };

    recommended: Linter.Config & {
      name: "promise/recommended";
      plugins: {
        promise: typeof promisePlugin;
      };
      rules: Linter.RulesRecord & {
        "promise/always-return": "error";
        "promise/no-return-wrap": "error";
        "promise/param-names": "error";
        "promise/catch-or-return": "error";
        "promise/no-native": "off";
        "promise/no-nesting": "warn";
        "promise/no-promise-in-callback": "warn";
        "promise/no-callback-in-promise": "warn";
        "promise/avoid-new": "off";
        "promise/no-new-statics": "error";
        "promise/no-return-in-finally": "warn";
        "promise/valid-params": "warn";
      };
    };
  };

  rules: Record<string, Rule.RuleModule>;
};

export type PromisePlugin = typeof promisePlugin;
export default promisePlugin;
