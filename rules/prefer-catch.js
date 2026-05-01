/**
 * Rule: prefer-catch
 * Discourage using then(a, b) or then(null, b) and instead use catch().
 */

import getDocsUrl from "./lib/get-docs-url.js";
import removeArgument from "./fix/remove-argument.js";
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer `catch` to `then(a, b)`/`then(null, b)` for handling errors.",
      url: getDocsUrl("prefer-catch"),
    },
    fixable: "code",
    schema: [],
    messages: {
      preferCatchToThen: "Prefer `catch` to `then(a, b)`/`then(null, b)`.",
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      "CallExpression > MemberExpression.callee"(node) {
        if (node.property?.name === "then" && node.parent.arguments.length >= 2) {
          context.report({
            node: node.property,
            messageId: "preferCatchToThen",
            *fix(fixer) {
              const then = node.parent.arguments[0];
              if (
                (then.type === "Literal" && then.value === null) ||
                (then.type === "Identifier" && then.name === "undefined")
              ) {
                yield removeArgument(fixer, then, sourceCode);
                yield fixer.replaceText(node.property, "catch");
              } else {
                const catcher = node.parent.arguments[1];
                const catcherText = sourceCode.getText(catcher);
                yield removeArgument(fixer, catcher, sourceCode);
                yield fixer.insertTextBefore(node.property, `catch(${catcherText}).`);
              }
            },
          });
        }
      },
    };
  },
};
