/**
 * Library: isPromiseConstructor
 * Makes sure that an Expression node is new Promise().
 */

/**
 * @typedef {import("estree").Node} Node
 * @typedef {import("estree").Expression} Expression
 * @typedef {import("estree").NewExpression} NewExpression
 * @typedef {import("estree").FunctionExpression} FunctionExpression
 * @typedef {import("estree").ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {NewExpression & { callee: { type: "Identifier"; name: "Promise" } }} NewPromise
 * @typedef {NewPromise & { arguments: [FunctionExpression | ArrowFunctionExpression] }} NewPromiseWithInlineExecutor
 */

/**
 * Checks whether the given node is new Promise().
 *
 * @param {Node} node - Node to inspect.
 * @returns {node is NewPromise} Whether the node is a `new Promise()` expression.
 */
export function isPromiseConstructor(node) {
  return (
    node.type === "NewExpression" &&
    node.callee.type === "Identifier" &&
    node.callee.name === "Promise"
  );
}

/**
 * Checks whether the given node is new Promise(() => {}).
 *
 * @param {Node} node - Node to inspect.
 * @returns {node is NewPromiseWithInlineExecutor} Whether the node is `new Promise()` with an inline executor.
 */
export function isPromiseConstructorWithInlineExecutor(node) {
  return (
    isPromiseConstructor(node) &&
    node.arguments.length === 1 &&
    (node.arguments[0].type === "FunctionExpression" ||
      node.arguments[0].type === "ArrowFunctionExpression")
  );
}
