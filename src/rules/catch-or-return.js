/**
 * Rule: catch-or-return
 * Ensures that promises either include a catch() handler
 * or are returned (to be handled upstream)
 */

import getDocsUrl from "./lib/get-docs-url.js";
import isPromise from "./lib/is-promise.js";
import isMemberCallWithObjectName from "./lib/is-member-call-with-object-name.js";

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce the use of `catch()` on un-returned promises.",
      url: getDocsUrl("catch-or-return"),
    },
    messages: {
      terminationMethod: "Expected {{ terminationMethod }}() or return",
    },
    schema: [
      {
        type: "object",
        properties: {
          allowFinally: {
            type: "boolean",
            description: "Allow `.finally()` after an allowed terminating method.",
          },
          allowThen: {
            type: "boolean",
            description: "Allow two-argument `.then()` calls as terminating handlers.",
          },
          allowThenStrict: {
            type: "boolean",
            description: "Only allow `.then(null, handler)` as a terminating handler.",
          },
          terminationMethod: {
            description: "Method name or names that count as promise termination.",
            oneOf: [
              { type: "string", description: "Single terminating method name." },
              {
                type: "array",
                description: "List of terminating method names.",
                items: {
                  type: "string",
                },
              },
            ],
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        allowFinally: false,
        allowThen: false,
        allowThenStrict: false,
        terminationMethod: "catch",
      },
    ],
  },
  create(context) {
    const [
      { allowFinally, allowThen, allowThenStrict, terminationMethod: configuredTerminationMethod },
    ] = context.options;
    let terminationMethod = configuredTerminationMethod;

    if (typeof terminationMethod === "string") {
      terminationMethod = [terminationMethod];
    }

    /**
     * Checks whether an expression satisfies the configured promise termination contract.
     *
     * @param {import("eslint").Rule.Node} expression - Expression node to inspect.
     * @returns {boolean} Whether the expression is an allowed promise termination.
     */
    function isAllowedPromiseTermination(expression) {
      // somePromise.then(a, b)
      if (
        (allowThen || allowThenStrict) &&
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        expression.callee.property.name === "then" &&
        expression.arguments.length === 2 &&
        // somePromise.then(null, b)
        ((allowThen && !allowThenStrict) ||
          (expression.arguments[0].type === "Literal" && expression.arguments[0].value === null))
      ) {
        return true;
      }

      // somePromise.catch().finally(fn)
      if (
        allowFinally &&
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        expression.callee.property.name === "finally" &&
        isPromise(expression.callee.object) &&
        isAllowedPromiseTermination(expression.callee.object)
      ) {
        return true;
      }

      // somePromise.catch()
      if (
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        terminationMethod.includes(expression.callee.property.name)
      ) {
        return true;
      }

      // somePromise['catch']()
      if (
        expression.type === "CallExpression" &&
        expression.callee.type === "MemberExpression" &&
        expression.callee.property.type === "Literal" &&
        expression.callee.property.value === "catch"
      ) {
        return true;
      }

      // cy.get().then(a, b);
      if (isMemberCallWithObjectName("cy", expression)) {
        return true;
      }

      return false;
    }

    return {
      ExpressionStatement(node) {
        if (!isPromise(node.expression)) {
          return;
        }

        if (isAllowedPromiseTermination(node.expression)) {
          return;
        }

        context.report({
          node,
          messageId: "terminationMethod",
          data: { terminationMethod },
        });
      },
    };
  },
};
