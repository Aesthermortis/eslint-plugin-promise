/**
 * Check whether a function node is used as a Promise callback.
 *
 * @param {import("eslint").Rule.Node} node - The AST node to evaluate.
 * @returns {boolean} Whether the node is inside a Promise `then`/`catch` callback.
 */
function isInsidePromise(node) {
  if (node.type !== "FunctionExpression" && node.type !== "ArrowFunctionExpression") {
    return false;
  }

  const parent = node.parent;
  if (
    !parent ||
    parent.type !== "CallExpression" ||
    parent.callee.type !== "MemberExpression" ||
    parent.callee.property.type !== "Identifier"
  ) {
    return false;
  }

  const name = parent.callee.property.name;
  return name === "then" || name === "catch";
}

export default isInsidePromise;
