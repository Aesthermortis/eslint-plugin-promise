import isNamedCallback from "./is-named-callback.js";

/**
 * Check if an AST node represents a callback function call.
 *
 * @param {import("eslint").Rule.Node} node - The AST node to check.
 * @param {string[]} exceptions - Callback names to exclude from the check.
 * @returns {boolean} Whether the node is a callback call expression.
 */
function isCallback(node, exceptions) {
  const isCallExpression = node.type === "CallExpression";
  // istanbul ignore next -- always invoked on `CallExpression`
  const callee = node.callee || {};
  const nameIsCallback = isNamedCallback(callee.name, exceptions);
  const isCB = isCallExpression && nameIsCallback;
  return isCB;
}

export default isCallback;
