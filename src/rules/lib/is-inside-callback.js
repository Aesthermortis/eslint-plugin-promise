import isInsidePromise from "./is-inside-promise.js";

/**
 * Checks whether a node is a callback function that receives an error argument.
 *
 * @param {import("eslint").Rule.Node} node - Node to inspect.
 * @param {boolean} [exemptDeclarations] - Whether function declarations are excluded.
 * @returns {boolean | undefined} Whether the node is inside a callback, or `undefined` when promises are allowed.
 */
function isInsideCallback(node, exemptDeclarations) {
  // it's totally fine to use promises inside promises
  if (isInsidePromise(node)) {
    return;
  }

  if (
    node.type !== "FunctionExpression" &&
    node.type !== "ArrowFunctionExpression" &&
    (exemptDeclarations || node.type !== "FunctionDeclaration")
  ) {
    return false;
  }

  const name = node.params[0]?.type === "Identifier" ? node.params[0].name : undefined;
  const firstArgIsError = name === "err" || name === "error";
  return firstArgIsError;
}

export default isInsideCallback;
