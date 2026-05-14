/**
 * Rule: no-return-wrap function
 * Prevents unnecessary wrapping of results in Promise.resolve
 * or Promise.reject as the Promise will do that for us
 */

import getDocsUrl from "./lib/get-docs-url.js";
import isPromise from "./lib/is-promise.js";

/**
 * @typedef {import("estree").Node} Node
 * @typedef {import("estree").SimpleCallExpression} CallExpression
 * @typedef {Node & { parent?: Node }} NodeWithParent
 */

/**
 * Gets the parent node added by ESLint during traversal.
 *
 * @param {Node} node - Node whose parent should be read.
 * @returns {Node | undefined} Parent node when ESLint has attached it.
 */
function getParent(node) {
  return /** @type {NodeWithParent} */ (node).parent;
}

/**
 * Check whether the given node is returned from a function that belongs to a Promise chain.
 *
 * @param {import("eslint").Rule.RuleContext} context - The rule context.
 * @param {Node} node - The node to evaluate.
 * @returns {boolean} Whether the node is inside a Promise-related function context.
 */
function isInPromise(context, node) {
  /** @type {Node | undefined} */
  let functionNode = context.sourceCode.getAncestors(node).findLast((node) => {
    return node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression";
  });

  while (functionNode) {
    const parent = getParent(functionNode);
    const grandparent = parent ? getParent(parent) : undefined;
    if (
      parent?.type !== "MemberExpression" ||
      parent.object !== functionNode ||
      parent.property.type !== "Identifier" ||
      parent.property.name !== "bind" ||
      grandparent?.type !== "CallExpression" ||
      grandparent.callee !== parent
    ) {
      break;
    }

    functionNode = grandparent;
  }

  const parent = functionNode ? getParent(functionNode) : undefined;
  return parent !== undefined && isPromise(parent);
}

/** @import {PromiseRuleModule} from "../types.d.ts" */

/** @type {PromiseRuleModule} */
const rule = {
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
     * @param {CallExpression} callExpression - The call expression to inspect.
     * @param {Node} node - The node to report if needed.
     * @returns {void}
     */
    function checkCallExpression(callExpression, node) {
      const { callee } = callExpression;
      if (
        isInPromise(context, node) &&
        callee.type === "MemberExpression" &&
        callee.object.type === "Identifier" &&
        callee.object.name === "Promise" &&
        callee.property.type === "Identifier"
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

export default rule;
