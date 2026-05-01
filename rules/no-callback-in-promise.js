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

const isInsideTimeout = (node) => {
  const isFunctionExpression =
    node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression";
  const parent = node.parent || {};
  const callee = parent.callee || {};
  const name = (callee.property && callee.property.name) || callee.name || "";
  const parentIsTimeout = TIMEOUT_WHITELIST.has(name);
  const isInCB = isFunctionExpression && parentIsTimeout;
  return isInCB;
};

export default {
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
          const name = node.arguments?.[0]?.name;
          if (hasPromiseCallback(node)) {
            const callingName = node.callee.name || node.callee.property?.name;
            if (
              !exceptions.includes(name) &&
              CB_BLACKLIST.has(name) &&
              (timeoutsErr || !TIMEOUT_WHITELIST.has(callingName))
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
        const insidePromise = ancestors.some((ancestor) => isInsidePromise(ancestor));
        const insideTimeout = ancestors.some((ancestor) => isInsideTimeout(ancestor));
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
