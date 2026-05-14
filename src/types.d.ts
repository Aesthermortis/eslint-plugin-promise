import type { Rule } from "eslint";

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
