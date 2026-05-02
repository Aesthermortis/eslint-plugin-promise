/**
 * Rule: no-return-wrap function
 * Prevents unnecessary wrapping of results in Promise.resolve
 * or Promise.reject as the Promise will do that for us
 */

import getDocsUrl from "./lib/get-docs-url.js";
import isPromise from "./lib/is-promise.js";

/**
 * Check whether the given node is returned from a function that belongs to a Promise chain.
 *
 * @param {import("eslint").Rule.RuleContext} context - The rule context.
 * @param {import("eslint").Rule.Node} node - The node to evaluate.
 * @returns {boolean} Whether the node is inside a Promise-related function context.
 */
function isInPromise(context, node) {
  let functionNode = context.sourceCode.getAncestors(node).findLast((node) => {
    return node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression";
  });
  while (
    functionNode &&
    functionNode.parent &&
    functionNode.parent.type === "MemberExpression" &&
    functionNode.parent.object === functionNode &&
    functionNode.parent.property.type === "Identifier" &&
    functionNode.parent.property.name === "bind" &&
    functionNode.parent.parent &&
    functionNode.parent.parent.type === "CallExpression" &&
    functionNode.parent.parent.callee === functionNode.parent
  ) {
    functionNode = functionNode.parent.parent;
  }
  return functionNode && functionNode.parent && isPromise(functionNode.parent);
}

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow wrapping values in `Promise.resolve` or `Promise.reject` when not needed.",
      url: getDocsUrl("no-return-wrap"),
    },
    messages: {
      resolve: "Avoid wrapping return values in Promise.resolve",
      reject: "Expected throw instead of Promise.reject",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowReject: {
            type: "boolean",
            description: "Whether `Promise.reject()` is allowed instead of throwing.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        allowReject: false,
      },
    ],
  },
  create(context) {
    const [{ allowReject }] = context.options;

    /**
     * Check a call expression and report when Promise.resolve/reject wrapping is unnecessary.
     *
     * @param {{ callee: import("eslint").Rule.Node }} callExpression - The call expression to inspect.
     * @param {import("eslint").Rule.Node} node - The node to report if needed.
     * @returns {void}
     */
    function checkCallExpression({ callee }, node) {
      if (
        isInPromise(context, node) &&
        callee.type === "MemberExpression" &&
        callee.object.name === "Promise"
      ) {
        if (callee.property.name === "resolve") {
          context.report({ node, messageId: "resolve" });
        } else if (!allowReject && callee.property.name === "reject") {
          context.report({ node, messageId: "reject" });
        }
      }
    }

    return {
      ReturnStatement(node) {
        if (node.argument && node.argument.type === "CallExpression") {
          checkCallExpression(node.argument, node);
        }
      },
      "ArrowFunctionExpression > CallExpression"(node) {
        checkCallExpression(node, node);
      },
    };
  },
};
