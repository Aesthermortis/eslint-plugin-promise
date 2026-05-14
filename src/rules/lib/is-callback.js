import isNamedCallback from "./is-named-callback.js";

/**
 * Check if an AST node represents a callback function call.
 *
 * @param {import("estree").CallExpression} node - The call expression to check.
 * @param {string[]} exceptions - Callback names to exclude from the check.
 * @returns {boolean} Whether the node is a callback call expression.
 */
function isCallback(node, exceptions) {
  if (node.callee.type !== "Identifier") {
    return false;
  }

  return isNamedCallback(node.callee.name, exceptions);
}

export default isCallback;
