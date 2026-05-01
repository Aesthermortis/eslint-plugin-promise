import isInsidePromise from "./is-inside-promise.js";

/**
 * Checks whether a node is a callback function that receives an error argument.
 *
 * @param {import("eslint").Rule.Node} node - Node to inspect.
 * @param {boolean} [exemptDeclarations] - Whether function declarations are excluded.
 * @returns {boolean | undefined} Whether the node is inside a callback, or `undefined` when promises are allowed.
 */
function isInsideCallback(node, exemptDeclarations) {
  const isFunction =
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression" ||
    (!exemptDeclarations && node.type === "FunctionDeclaration"); // this may be controversial

  // it's totally fine to use promises inside promises
  if (isInsidePromise(node)) return;

  const name = node.params && node.params[0] && node.params[0].name;
  const firstArgIsError = name === "err" || name === "error";
  const isInACallback = isFunction && firstArgIsError;
  return isInACallback;
}

export default isInsideCallback;
