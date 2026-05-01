/**
 * Library: Has Promise Callback
 * Makes sure that an Expression node is part of a promise
 * with callback functions (like then() or catch())
 */

/**
 * @typedef {import("estree").SimpleCallExpression} CallExpression
 * @typedef {import("estree").MemberExpression} MemberExpression
 * @typedef {import("estree").Identifier} Identifier
 * @typedef {object} NameIsThenOrCatch
 * @typedef {object} PropertyIsThenOrCatch
 * @typedef {object} CalleeIsPromiseCallback
 * @typedef {CallExpression & CalleeIsPromiseCallback} HasPromiseCallback
 * @property {"then" | "catch"} name Promise callback method name.
 * @property {Identifier & NameIsThenOrCatch} property Member property that names the callback method.
 * @property {MemberExpression & PropertyIsThenOrCatch} callee Member expression used as the call callee.
 */

/**
 * Checks whether a node is a `.then()` or `.catch()` call expression.
 *
 * @param {import("estree").Node} node Node to inspect.
 * @returns {node is HasPromiseCallback} Whether the node is a promise callback call.
 */
function hasPromiseCallback(node) {
  // istanbul ignore if -- only being called within `CallExpression`
  if (node.type !== "CallExpression") return false;
  if (node.callee.type !== "MemberExpression") return false;
  const propertyName = node.callee.property.name;
  return propertyName === "then" || propertyName === "catch";
}

export default hasPromiseCallback;
