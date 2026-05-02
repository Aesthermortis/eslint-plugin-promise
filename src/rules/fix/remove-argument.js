/**
 * Adapted from `eslint-plugin-unicorn`
 *
 * @license MIT
 */

import { isCommaToken } from "@eslint-community/eslint-utils";
import { getParentheses } from "../lib/parentheses.js";

/**
 * Remove an argument from a call expression while preserving valid commas and spacing.
 *
 * @param {import("eslint").Rule.RuleFixer} fixer - The ESLint fixer instance.
 * @param {import("eslint").Rule.Node} node - The argument node to remove.
 * @param {import("eslint").SourceCode} sourceCode - The source code instance.
 * @returns {import("eslint").Rule.Fix} The fix operation that removes the argument range.
 */
function removeArgument(fixer, node, sourceCode) {
  const callExpression = node.parent;
  const index = callExpression.arguments.indexOf(node);
  const parentheses = getParentheses(node, sourceCode);
  const firstToken = parentheses[0] || node;
  const lastToken = parentheses.at(-1) || node;

  let [start] = firstToken.range;
  let [, end] = lastToken.range;

  if (index !== 0) {
    start = sourceCode.getTokenBefore(firstToken).range[0];
  }

  // If there are subsequent arguments, the trailing comma must be removed too
  /* istanbul ignore else */
  if (index < callExpression.arguments.length - 1) {
    let tokenAfter = sourceCode.getTokenAfter(lastToken);
    /* istanbul ignore else */
    if (isCommaToken(tokenAfter)) {
      // Advance to start of next token (after whitespace)
      tokenAfter = sourceCode.getTokenAfter(tokenAfter);
      end = tokenAfter.range[0];
    }
  }
  // If the removed argument is the only argument, the trailing comma must be removed too
  else if (callExpression.arguments.length === 1) {
    const tokenAfter = sourceCode.getTokenBefore(lastToken);
    if (isCommaToken(tokenAfter)) {
      end = tokenAfter[1];
    }
  }

  return fixer.replaceTextRange([start, end], "");
}

export default removeArgument;
