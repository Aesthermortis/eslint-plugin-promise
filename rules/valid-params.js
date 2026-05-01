import getDocsUrl from "./lib/get-docs-url.js";
import isPromise from "./lib/is-promise.js";
export default {
  meta: {
    type: "problem",
    docs: {
      description: "Enforces the proper number of arguments are passed to Promise functions.",
      url: getDocsUrl("valid-params"),
    },
    schema: [
      {
        type: "object",
        properties: {
          exclude: {
            type: "array",
            description: "Promise methods to skip when validating argument counts.",
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
        exclude: [],
      },
    ],
    messages: {
      requireOneOptionalArgument:
        "Promise.{{ name }}() requires 0 or 1 arguments, but received {{ numArgs }}",
      requireOneArgument: "Promise.{{ name }}() requires 1 argument, but received {{ numArgs }}",
      requireTwoOptionalArguments:
        "Promise.{{ name }}() requires 1 or 2 arguments, but received {{ numArgs }}",
    },
  },
  create(context) {
    const [{ exclude }] = context.options;
    return {
      CallExpression(node) {
        if (!isPromise(node)) {
          return;
        }

        const name = node.callee.property.name;
        const numArgs = node.arguments.length;

        if (exclude.includes(name)) {
          return;
        }

        // istanbul ignore next -- `isPromise` filters out others
        switch (name) {
          case "resolve":
          case "reject": {
            if (numArgs > 1) {
              context.report({
                node,
                messageId: "requireOneOptionalArgument",
                data: { name, numArgs },
              });
            }
            break;
          }
          case "then": {
            if (numArgs < 1 || numArgs > 2) {
              context.report({
                node,
                messageId: "requireTwoOptionalArguments",
                data: { name, numArgs },
              });
            }
            break;
          }
          case "race":
          case "all":
          case "allSettled":
          case "any":
          case "catch":
          case "finally": {
            if (numArgs !== 1) {
              context.report({
                node,
                messageId: "requireOneArgument",
                data: { name, numArgs },
              });
            }
            break;
          }
          default: {
            break;
          }
        }
      },
    };
  },
};
