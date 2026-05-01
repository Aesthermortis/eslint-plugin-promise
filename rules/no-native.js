// Borrowed from here:
// https://github.com/colonyamerican/eslint-plugin-cah/issues/3

import getDocsUrl from "./lib/get-docs-url.js";

/**
 * @typedef {import("eslint").Scope.Reference} Reference
 * @typedef {import("eslint").Scope.Scope} Scope
 */

/**
 * Checks whether a reference is declared in the current scope.
 *
 * @param {Scope} scope Scope to inspect.
 * @param {Reference} reference Reference to match.
 * @returns {boolean} Whether the reference has a local declaration.
 */
function isDeclared(scope, reference) {
  return scope.variables.some((variable) => {
    if (variable.name !== reference.identifier.name) {
      return false;
    }

    // istanbul ignore next
    return variable.defs.length > 0;
  });
}

export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require creating a `Promise` constructor before using it in an ES5 environment.",
      url: getDocsUrl("no-native"),
    },
    messages: {
      name: '"{{name}}" is not defined.',
    },
    schema: [],
  },
  create(context) {
    return {
      "Program:exit"() {
        const globalScope = context.sourceCode.scopeManager.globalScope;

        for (const variable of globalScope.variables) {
          if (variable.name === "Promise") {
            for (const reference of variable.references) {
              validatePromiseReference(globalScope, reference);
            }
          }
        }

        for (const reference of globalScope.through) {
          if (reference.identifier.name === "Promise") {
            validatePromiseReference(globalScope, reference);
          }
        }

        /**
         * Reports references that use the native Promise global.
         *
         * @param {Scope} scope Scope that owns the reference.
         * @param {Reference} reference Reference to validate.
         * @returns {void}
         */
        function validatePromiseReference(scope, reference) {
          if (!isDeclared(scope, reference)) {
            context.report({
              node: reference.identifier,
              messageId: "name",
              data: { name: reference.identifier.name },
            });
          }
        }
      },
    };
  },
};
