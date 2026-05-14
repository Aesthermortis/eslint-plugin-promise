import getDocsUrl from "./lib/get-docs-url.js";

/**
 * @typedef {import("estree").Node} Node
 * @typedef {import("estree").CallExpression} CallExpression
 * @typedef {import("estree").Expression | import("estree").SpreadElement} CallArgument
 * @typedef {import("estree").FunctionDeclaration} FunctionDeclaration
 * @typedef {import("estree").FunctionExpression} FunctionExpression
 * @typedef {import("estree").ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} FunctionWithParams
 * @typedef {FunctionExpression | ArrowFunctionExpression} CallbackFunction
 */

const ARRAY_METHODS = new Set(["map", "every", "forEach", "some", "find", "filter"]);
const CALLBACK_NAMES = new Set(["callback", "cb"]);
const ERROR_NAMES = new Set(["err", "error"]);

/**
 * Checks whether a node is a function expression usable as a callback argument.
 *
 * @param {CallArgument | undefined} node - Node to check.
 * @returns {node is CallbackFunction} Whether the node is a function expression or arrow function expression.
 */
function isFunctionNode(node) {
  return node?.type === "FunctionExpression" || node?.type === "ArrowFunctionExpression";
}

/**
 * Gets the final argument from a call expression.
 *
 * @param {CallExpression} node - Call expression to inspect.
 * @returns {CallArgument | undefined} Last call argument, if present.
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
  if (node.callee.type !== "MemberExpression" || node.callee.property.type !== "Identifier") {
    return false;
  }
  return node.callee.property.name === "on" || node.callee.property.name === "once";
}

/**
 * Checks whether a call expression is a known array-style iteration callback.
 *
 * @param {CallExpression} node - Call expression to inspect.
 * @returns {boolean} Whether the call is an array, lodash, underscore, or imported array helper call.
 */
function isArrayMethodCallback(node) {
  if (node.callee.type === "MemberExpression") {
    const objectName = node.callee.object.type === "Identifier" ? node.callee.object.name : "";
    const propertyName =
      node.callee.property.type === "Identifier" ? node.callee.property.name : "";
    const isLodash = ["lodash", "underscore", "_"].includes(objectName);
    return (
      ARRAY_METHODS.has(propertyName) &&
      (node.arguments.length === 1 || (node.arguments.length === 2 && isLodash))
    );
  }

  const calleeName = node.callee.type === "Identifier" ? node.callee.name : "";
  const isLodash =
    node.callee.type === "Identifier" && ["lodash", "underscore", "_"].includes(calleeName);
  return !isLodash && ARRAY_METHODS.has(calleeName) && node.arguments.length === 2;
}

/**
 * Checks whether a callback function uses an error-first parameter name.
 *
 * @param {CallbackFunction} callbackArg - Callback argument to inspect.
 * @returns {boolean} Whether the first callback parameter is named `err` or `error`.
 */
function hasErrorFirstParameter(callbackArg) {
  const firstParam = callbackArg.params[0];
  return firstParam?.type === "Identifier" && ERROR_NAMES.has(firstParam.name);
}

/** @import {PromiseRuleModule} from "../types.d.ts" */

/** @type {PromiseRuleModule} */
const rule = {
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
      const lastParam = node.params.at(-1);
      if (lastParam?.type === "Identifier" && CALLBACK_NAMES.has(lastParam.name)) {
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
        if (node.callee.type === "Identifier" && CALLBACK_NAMES.has(node.callee.name)) {
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

export default rule;
