import PROMISE_STATICS from "./lib/promise-statics.js";
import getDocsUrl from "./lib/get-docs-url.js";
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow calling `new` on a Promise static method.",
      url: getDocsUrl("no-new-statics"),
    },
    fixable: "code",
    schema: [],
    messages: {
      avoidNewStatic: "Avoid calling 'new' on 'Promise.{{ name }}()'",
    },
  },
  create(context) {
    return {
      NewExpression(node) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === "Promise" &&
          PROMISE_STATICS.has(node.callee.property.name)
        ) {
          context.report({
            node,
            messageId: "avoidNewStatic",
            data: { name: node.callee.property.name },
            fix(fixer) {
              return fixer.replaceTextRange([node.range[0], node.range[0] + "new ".length], "");
            },
          });
        }
      },
    };
  },
};
