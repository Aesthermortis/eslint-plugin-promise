/**
 * Rule: avoid-new
 * Avoid creating new promises outside of utility libraries.
 */

import getDocsUrl from "./lib/get-docs-url.js";
export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow creating `new` promises outside of utility libs (use [util.promisify][] instead).",
      url: getDocsUrl("avoid-new"),
    },
    schema: [],
    messages: {
      avoidNew: "Avoid creating new promises.",
    },
  },
  create(context) {
    return {
      NewExpression(node) {
        if (node.callee.name === "Promise") {
          context.report({ node, messageId: "avoidNew" });
        }
      },
    };
  },
};
