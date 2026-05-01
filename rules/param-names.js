import getDocsUrl from "./lib/get-docs-url.js";
import { isPromiseConstructorWithInlineExecutor } from "./lib/is-promise-constructor.js";

/**
 * Builds a regular expression from a user-provided rule option.
 *
 * @param {string} pattern - Regular expression source configured by the user.
 * @returns {RegExp} Compiled Unicode regular expression.
 */
function compilePattern(pattern) {
  // eslint-disable-next-line security/detect-non-literal-regexp -- This rule intentionally accepts regex sources as options.
  return new RegExp(pattern, "u");
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce consistent param names and ordering when creating new promises.",
      url: getDocsUrl("param-names"),
    },
    schema: [
      {
        type: "object",
        properties: {
          resolvePattern: {
            type: "string",
            description: "Regular expression source for the resolve parameter name.",
          },
          rejectPattern: {
            type: "string",
            description: "Regular expression source for the reject parameter name.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        resolvePattern: "^_?resolve$",
        rejectPattern: "^_?reject$",
      },
    ],
    messages: {
      resolveParamNames:
        'Promise constructor parameters must be named to match "{{ resolvePattern }}"',
      rejectParamNames:
        'Promise constructor parameters must be named to match "{{ rejectPattern }}"',
    },
  },
  create(context) {
    const [{ rejectPattern: rejectPatternSource, resolvePattern: resolvePatternSource }] =
      context.options;
    const resolvePattern = compilePattern(resolvePatternSource);
    const rejectPattern = compilePattern(rejectPatternSource);

    return {
      NewExpression(node) {
        if (isPromiseConstructorWithInlineExecutor(node)) {
          const params = node.arguments[0].params;

          if (!params || params.length === 0) {
            return;
          }

          const resolveParamName = params[0] && params[0].name;
          if (resolveParamName && !resolvePattern.test(resolveParamName)) {
            context.report({
              node: params[0],
              messageId: "resolveParamNames",
              data: {
                resolvePattern: resolvePattern.source,
              },
            });
          }
          const rejectParamName = params[1] && params[1].name;
          if (rejectParamName && !rejectPattern.test(rejectParamName)) {
            context.report({
              node: params[1],
              messageId: "rejectParamNames",
              data: {
                rejectPattern: rejectPattern.source,
              },
            });
          }
        }
      },
    };
  },
};
