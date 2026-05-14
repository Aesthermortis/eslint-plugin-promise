import PROMISE_STATICS from "./promise-statics.js";

/**
 * Get the identifier name from a member expression property.
 *
 * @param {import("estree").MemberExpression} expression - Member expression to inspect.
 * @returns {string | undefined} Property name when the member uses an identifier.
 */
function getMemberPropertyName(expression) {
  return expression.property.type === "Identifier" ? expression.property.name : undefined;
}

/**
 * Check whether an expression belongs to a Promise chain or Promise static call.
 *
 * @param {import("estree").Node} expression - The AST expression node to evaluate.
 * @returns {boolean} Whether the expression is recognized as promise-related.
 */
function isPromise(expression) {
  if (expression.type !== "CallExpression" || expression.callee.type !== "MemberExpression") {
    return false;
  }

  const propertyName = getMemberPropertyName(expression.callee);

  return (
    // hello.then()
    propertyName === "then" ||
    // hello.catch()
    propertyName === "catch" ||
    // hello.finally()
    propertyName === "finally" ||
    // somePromise.ANYTHING()
    (expression.callee.object.type !== "Super" && isPromise(expression.callee.object)) ||
    // Promise.STATIC_METHOD()
    (propertyName !== undefined &&
      expression.callee.object.type === "Identifier" &&
      expression.callee.object.name === "Promise" &&
      PROMISE_STATICS.has(propertyName) &&
      propertyName !== "withResolvers")
  );
}

export default isPromise;
