/**
 * Rule: prefer-await-to-then
 * Discourage using then()/catch()/finally() and instead use async/await.
 */

import getDocsUrl from "./lib/get-docs-url.js";
import isMemberCallWithObjectName from "./lib/is-member-call-with-object-name.js";
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prefer `await` to `then()`/`catch()`/`finally()` for reading Promise values.",
      url: getDocsUrl("prefer-await-to-then"),
    },
    schema: [
      {
        type: "object",
        properties: {
          strict: {
            type: "boolean",
            description:
              "Whether to report `.then()` chains even in contexts where `await` is awkward.",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        strict: false,
      },
    ],
    messages: {
      preferAwaitToCallback: "Prefer await to then()/catch()/finally().",
    },
  },
  create(context) {
    /**
     * Check whether a node is inside an await or yield expression.
     *
     * @param {import("eslint").Rule.Node} node - The node to check.
     * @returns {boolean} Whether the node is inside `await` or `yield`.
     */
    function isInsideYieldOrAwait(node) {
      return context.sourceCode.getAncestors(node).some((parent) => {
        return parent.type === "AwaitExpression" || parent.type === "YieldExpression";
      });
    }

    /**
     * Check whether a node is inside a class constructor.
     *
     * @param {import("eslint").Rule.Node} node - The node to check.
     * @returns {boolean} Whether the node is inside a constructor method.
     */
    function isInsideConstructor(node) {
      return context.sourceCode.getAncestors(node).some((parent) => {
        return parent.type === "MethodDefinition" && parent.kind === "constructor";
      });
    }

    /**
     * Check whether a node belongs to the top-level program scope.
     *
     * @param {import("eslint").Rule.Node} node - The node to check.
     * @returns {boolean} Whether the node is in top-level scope.
     */
    function isTopLevelScoped(node) {
      return context.sourceCode.getScope(node).block.type === "Program";
    }

    const [{ strict }] = context.options;

    return {
      "CallExpression > MemberExpression.callee"(node) {
        if (
          isTopLevelScoped(node) ||
          (!strict && isInsideYieldOrAwait(node)) ||
          (!strict && isInsideConstructor(node)) ||
          isMemberCallWithObjectName("cy", node.parent)
        ) {
          return;
        }

        // if you're a then/catch/finally expression then you're probably a promise
        if (
          node.property &&
          (node.property.name === "then" ||
            node.property.name === "catch" ||
            node.property.name === "finally")
        ) {
          context.report({
            node: node.property,
            messageId: "preferAwaitToCallback",
          });
        }
      },
    };
  },
};
