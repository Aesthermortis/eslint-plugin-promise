/**
 * Check whether a function node is used as a Promise callback.
 *
 * @param {import("eslint").Rule.Node} node - The AST node to evaluate.
 * @returns {boolean} Whether the node is inside a Promise `then`/`catch` callback.
 */
function isInsidePromise(node) {
  const isFunctionExpression =
    node.type === "FunctionExpression" || node.type === "ArrowFunctionExpression";
  const parent = node.parent || {};
  const callee = parent.callee || {};
  const name = (callee.property && callee.property.name) || "";
  const parentIsPromise = name === "then" || name === "catch";
  const isInCB = isFunctionExpression && parentIsPromise;
  return isInCB;
}

export default isInsidePromise;
