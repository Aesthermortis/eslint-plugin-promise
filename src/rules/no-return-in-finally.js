import getDocsUrl from "./lib/get-docs-url.js";
import isPromise from "./lib/is-promise.js";

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow return statements in `finally()`.",
      url: getDocsUrl("no-return-in-finally"),
    },
    schema: [],
    messages: {
      avoidReturnInFinally: "No return in finally",
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          isPromise(node) &&
          node.callee &&
          node.callee.property &&
          node.callee.property.name === "finally" &&
          node.arguments &&
          node.arguments[0] &&
          node.arguments[0].body &&
          node.arguments[0].body.body &&
          node.arguments[0].body.body.some((statement) => {
            return statement.type === "ReturnStatement";
          })
        ) {
          context.report({
            node: node.callee.property,
            messageId: "avoidReturnInFinally",
          });
        }
      },
    };
  },
};
