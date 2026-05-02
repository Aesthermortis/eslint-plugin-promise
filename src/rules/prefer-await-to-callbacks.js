import getDocsUrl from "./lib/get-docs-url.js";

/**
 * @typedef {import("estree").Node} Node
 * @typedef {import("estree").CallExpression} CallExpression
 * @typedef {import("estree").FunctionDeclaration} FunctionDeclaration
 * @typedef {import("estree").FunctionExpression} FunctionExpression
 * @typedef {import("estree").ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} FunctionWithParams
 */

const ARRAY_METHODS = new Set(["map", "every", "forEach", "some", "find", "filter"]);
const CALLBACK_NAMES = new Set(["callback", "cb"]);
const ERROR_NAMES = new Set(["err", "error"]);

/**
 * Checks whether a node is a function expression usable as a callback argument.
 *
 * @param {Node | undefined} node - Node to check.
 * @returns {boolean} Whether the node is a function expression or arrow function expression.
 */
function isFunctionNode(node) {
  return node?.type === "FunctionExpression" || node?.type === "ArrowFunctionExpression";
}

/**
 * Gets the final argument from a call expression.
 *
 * @param {CallExpression} node - Call expression to inspect.
 * @returns {Node | undefined} Last call argument, if present.
 */
function getLastArgument(node) {
  return node.arguments.at(-1);
}

/**
 * Checks whether a call expression registers an event listener callback.
 *
 * @param {CallExpression} node - Call expression to inspect.
 * @returns {boolean} Whether the call is an `on` or `once` listener registration.
 */
function isEventListenerCallback(node) {
  return node.callee.property?.name === "on" || node.callee.property?.name === "once";
}

/**
 * Checks whether a call expression is a known array-style iteration callback.
 *
 * @param {CallExpression} node - Call expression to inspect.
 * @returns {boolean} Whether the call is an array, lodash, underscore, or imported array helper call.
 */
function isArrayMethodCallback(node) {
  const isLodash =
    node.callee.object && ["lodash", "underscore", "_"].includes(node.callee.object.name);
  const callsArrayMethod =
    node.callee.property &&
    ARRAY_METHODS.has(node.callee.property.name) &&
    (node.arguments.length === 1 || (node.arguments.length === 2 && isLodash));
  const isArrayMethod =
    node.callee.name && ARRAY_METHODS.has(node.callee.name) && node.arguments.length === 2;
  return callsArrayMethod || isArrayMethod;
}

/**
 * Checks whether a callback function uses an error-first parameter name.
 *
 * @param {Node | undefined} callbackArg - Callback argument to inspect.
 * @returns {boolean} Whether the first callback parameter is named `err` or `error`.
 */
function hasErrorFirstParameter(callbackArg) {
  const firstParam = callbackArg?.params?.[0];
  return ERROR_NAMES.has(firstParam?.name);
}

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer `async`/`await` to the callback pattern.",
      url: getDocsUrl("prefer-await-to-callbacks"),
    },
    messages: {
      error: "Avoid callbacks. Prefer Async/Await.",
    },
    schema: [],
  },
  create(context) {
    /**
     * Reports function declarations or expressions that expose callback-style final parameters.
     *
     * @param {FunctionWithParams} node - Function node to inspect.
     * @returns {void}
     */
    function checkLastParamsForCallback(node) {
      const lastParam = node.params.at(-1) || {};
      if (lastParam.name === "callback" || lastParam.name === "cb") {
        context.report({ node: lastParam, messageId: "error" });
      }
    }

    /**
     * Checks whether a node is nested in an await or yield expression.
     *
     * @param {Node} node - Node to inspect.
     * @returns {boolean} Whether the node is inside `await` or `yield`.
     */
    function isInsideYieldOrAwait(node) {
      return context.sourceCode.getAncestors(node).some((parent) => {
        return parent.type === "AwaitExpression" || parent.type === "YieldExpression";
      });
    }
    return {
      CallExpression(node) {
        // Callbacks aren't allowed.
        if (CALLBACK_NAMES.has(node.callee.name)) {
          context.report({ node, messageId: "error" });
          return;
        }

        // Then-ables aren't allowed either.
        const callbackArg = getLastArgument(node);
        if (!isFunctionNode(callbackArg)) {
          return;
        }
        if (isEventListenerCallback(node) || isArrayMethodCallback(node)) {
          return;
        }

        // actually check for callbacks (I know this is the worst)
        if (hasErrorFirstParameter(callbackArg) && !isInsideYieldOrAwait(node)) {
          context.report({ node: callbackArg, messageId: "error" });
        }
      },
      FunctionDeclaration: checkLastParamsForCallback,
      FunctionExpression: checkLastParamsForCallback,
      ArrowFunctionExpression: checkLastParamsForCallback,
    };
  },
};
