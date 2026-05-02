import PROMISE_STATICS from "./promise-statics.js";

/**
 * Check whether an expression belongs to a Promise chain or Promise static call.
 *
 * @param {import("eslint").Rule.Node} expression - The AST expression node to evaluate.
 * @returns {boolean} Whether the expression is recognized as promise-related.
 */
function isPromise(expression) {
  return (
    // hello.then()
    (expression.type === "CallExpression" &&
      expression.callee.type === "MemberExpression" &&
      expression.callee.property.name === "then") ||
    // hello.catch()
    (expression.type === "CallExpression" &&
      expression.callee.type === "MemberExpression" &&
      expression.callee.property.name === "catch") ||
    // hello.finally()
    (expression.type === "CallExpression" &&
      expression.callee.type === "MemberExpression" &&
      expression.callee.property.name === "finally") ||
    // somePromise.ANYTHING()
    (expression.type === "CallExpression" &&
      expression.callee.type === "MemberExpression" &&
      isPromise(expression.callee.object)) ||
    // Promise.STATIC_METHOD()
    (expression.type === "CallExpression" &&
      expression.callee.type === "MemberExpression" &&
      expression.callee.object.type === "Identifier" &&
      expression.callee.object.name === "Promise" &&
      PROMISE_STATICS.has(expression.callee.property.name) &&
      expression.callee.property.name !== "withResolvers")
  );
}

export default isPromise;
