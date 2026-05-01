/**
 * Rule: no-promise-in-callback
 * Discourage using promises inside of callbacks.
 */

import getDocsUrl from "./lib/get-docs-url.js";
import isPromise from "./lib/is-promise.js";
import isInsideCallback from "./lib/is-inside-callback.js";
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow using promises inside of callbacks.",
      url: getDocsUrl("no-promise-in-callback"),
    },
    schema: [
      {
        type: "object",
        properties: {
          exemptDeclarations: {
            type: "boolean",
            description: "Whether callback function declarations should be excluded.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        exemptDeclarations: false,
      },
    ],
    messages: {
      avoidPromiseInCallback: "Avoid using promises inside of callbacks.",
    },
  },
  create(context) {
    const [{ exemptDeclarations }] = context.options;

    return {
      CallExpression(node) {
        if (!isPromise(node)) return;

        // if i'm returning the promise, it's probably not really a callback
        // function, and I should be okay....
        if (node.parent.type === "ReturnStatement") return;

        // what about if the parent is an ArrowFunctionExpression
        // would that imply an implicit return?

        if (
          context.sourceCode.getAncestors(node).some((ancestor) => {
            return isInsideCallback(ancestor, exemptDeclarations);
          })
        ) {
          context.report({
            node: node.callee,
            messageId: "avoidPromiseInCallback",
          });
        }
      },
    };
  },
};
