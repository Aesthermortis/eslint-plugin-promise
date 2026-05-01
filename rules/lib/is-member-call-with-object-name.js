/**
 * @typedef {import("estree").Node} Node
 * @typedef {import("estree").SimpleCallExpression} CallExpression
 */

/**
 * Checks whether a call expression belongs to a member chain rooted at the given object name.
 *
 * @param {string} objectName Object name to match.
 * @param {Node} node Node to inspect.
 * @returns {node is CallExpression} Whether the node is a member call rooted at the object name.
 */
function isMemberCallWithObjectName(objectName, node) {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    ((node.callee.object.type === "Identifier" && node.callee.object.name === objectName) ||
      isMemberCallWithObjectName(objectName, node.callee.object))
  );
}

export default isMemberCallWithObjectName;
