/**
 * Rule: no-callback-in-promise
 * Avoid calling back inside of a promise
 */

import getDocsUrl from "./lib/get-docs-url.js";
import hasPromiseCallback from "./lib/has-promise-callback.js";
import isInsidePromise from "./lib/is-inside-promise.js";
import isCallback from "./lib/is-callback.js";
const CB_BLACKLIST = new Set(["callback", "cb", "next", "done"]);
const TIMEOUT_WHITELIST = new Set([
  "setImmediate",
  "setTimeout",
  "requestAnimationFrame",
  "nextTick",
]);

/**
 * Gets an identifier name from a node.
 *
 * @param {import("estree").Node | undefined} node Node to inspect.
 * @returns {string | undefined} Identifier name when present.
 */
function getIdentifierName(node) {
  return node?.type === "Identifier" ? node.name : undefined;
}

/**
 * Gets the called function or member name.
 *
 * @param {import("estree").Expression | import("estree").Super | undefined} callee Callee to inspect.
 * @returns {string | undefined} Call name when it can be resolved.
 */
function getCallName(callee) {
  if (callee?.type === "Identifier") {
    return callee.name;
  }

  if (callee?.type === "MemberExpression" && callee.property.type === "Identifier") {
    return callee.property.name;
  }
}

/**
 * Checks whether a function expression is passed to a timeout-like call.
 *
 * @param {import("eslint").Rule.Node} node Node to inspect.
 * @returns {boolean} Whether the node is inside a timeout-like call.
 */
const isInsideTimeout = (node) => {
  const isFunctionExpression =
    node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression";
  if (!isFunctionExpression || !node.parent || node.parent.type !== "CallExpression") {
    return false;
  }

  const name = getCallName(node.parent.callee);
  return name !== undefined && TIMEOUT_WHITELIST.has(name);
};

/** @import {PromiseRuleModule} from "../types.d.ts" */

/** @type {PromiseRuleModule} */
const rule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow calling `cb()` inside of a `then()` (use [util.callbackify][] instead).",
      url: getDocsUrl("no-callback-in-promise"),
    },
    messages: {
      callback: "Avoid calling back inside of a promise.",
    },
    schema: [
      {
        type: "object",
        properties: {
          exceptions: {
            type: "array",
            description: "Callback names that are allowed inside promise handlers.",
            items: {
              type: "string",
            },
          },
          timeoutsErr: {
            type: "boolean",
            description: "Whether timeout-style wrappers should still report callback usage.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        exceptions: [],
        timeoutsErr: false,
      },
    ],
  },

  create(context) {
    const [{ exceptions, timeoutsErr }] = context.options;

    return {
      CallExpression(node) {
        if (!isCallback(node, exceptions)) {
          const name = getIdentifierName(node.arguments[0]);
          if (hasPromiseCallback(node)) {
            const callingName = getCallName(node.callee);
            if (
              name !== undefined &&
              !exceptions.includes(name) &&
              CB_BLACKLIST.has(name) &&
              (timeoutsErr || callingName === undefined || !TIMEOUT_WHITELIST.has(callingName))
            ) {
              context.report({
                node: node.arguments[0],
                messageId: "callback",
              });
            }
            return;
          }
          if (!timeoutsErr) {
            return;
          }

          if (!name) {
            // Will be handled elsewhere
            return;
          }
        }

        const ancestors = context.sourceCode.getAncestors(node);
        const insidePromise = ancestors.some((ancestor) => {
          return isInsidePromise(
            /** @type {import("eslint").Rule.Node} */ (/** @type {unknown} */ (ancestor)),
          );
        });
        const insideTimeout = ancestors.some((ancestor) => {
          return isInsideTimeout(
            /** @type {import("eslint").Rule.Node} */ (/** @type {unknown} */ (ancestor)),
          );
        });
        if (insidePromise && (timeoutsErr || !insideTimeout)) {
          context.report({
            node,
            messageId: "callback",
          });
        }
      },
    };
  },
};

export default rule;
