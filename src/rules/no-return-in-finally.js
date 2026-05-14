import getDocsUrl from "./lib/get-docs-url.js";
import isPromise from "./lib/is-promise.js";

/** @import {PromiseRuleModule} from "../types.d.ts" */

/** @type {PromiseRuleModule} */
const rule = {
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
        if (!isPromise(node) || node.callee.type !== "MemberExpression") {
          return;
        }
        if (node.callee.property.type !== "Identifier" || node.callee.property.name !== "finally") {
          return;
        }

        const callback = node.arguments[0];
        if (
          !callback ||
          (callback.type !== "FunctionExpression" && callback.type !== "ArrowFunctionExpression") ||
          callback.body.type !== "BlockStatement" ||
          !callback.body.body.some((statement) => {
            return statement.type === "ReturnStatement";
          })
        ) {
          return;
        }

        context.report({
          node: node.callee.property,
          messageId: "avoidReturnInFinally",
        });
      },
    };
  },
};

export default rule;
