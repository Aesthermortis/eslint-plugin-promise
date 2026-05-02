import PROMISE_STATICS from "./lib/promise-statics.js";
import getDocsUrl from "./lib/get-docs-url.js";
const PROMISE_INSTANCE_METHODS = new Set(["then", "catch", "finally"]);

/**
 * Check whether a member expression property is allowed by the standard set or by user-configured extra methods.
 *
 * @param {import("eslint").Rule.Node} expression - The node to evaluate.
 * @param {Set<string>} standardSet - The set of standard Promise method names.
 * @param {string[]} allowedMethods - Extra method names allowed by configuration.
 * @returns {boolean} Whether the property access is permitted.
 */
function isPermittedProperty(expression, standardSet, allowedMethods) {
  // istanbul ignore if
  if (expression.type !== "MemberExpression") return false;

  if (expression.property.type === "Literal")
    return (
      standardSet.has(expression.property.value) ||
      allowedMethods.includes(expression.property.value)
    );

  // istanbul ignore else
  if (expression.property.type === "Identifier")
    return (
      expression.computed ||
      standardSet.has(expression.property.name) ||
      allowedMethods.includes(expression.property.name)
    );

  // istanbul ignore next
  return false;
}

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow use of non-standard Promise static methods.",
      url: getDocsUrl("spec-only"),
    },
    schema: [
      {
        type: "object",
        properties: {
          allowedMethods: {
            type: "array",
            description: "Extra Promise static or instance methods that are allowed.",
            items: {
              type: "string",
            },
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        allowedMethods: [],
      },
    ],
    messages: {
      avoidNonStandard: "Avoid using non-standard 'Promise.{{ name }}'",
    },
  },
  create(context) {
    const [{ allowedMethods }] = context.options;

    return {
      MemberExpression(node) {
        if (
          node.object.type === "Identifier" &&
          node.object.name === "Promise" &&
          ((node.property.name !== "prototype" &&
            !isPermittedProperty(node, PROMISE_STATICS, allowedMethods)) ||
            (node.property.name === "prototype" &&
              node.parent.type === "MemberExpression" &&
              !isPermittedProperty(node.parent, PROMISE_INSTANCE_METHODS, allowedMethods)))
        ) {
          context.report({
            node,
            messageId: "avoidNonStandard",
            data: { name: node.property.name ?? node.property.value },
          });
        }
      },
    };
  },
};
