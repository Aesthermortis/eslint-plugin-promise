/**
 * Adapted from `eslint-plugin-unicorn`
 *
 * @license MIT
 */

import {
  isClosingParenToken,
  isOpeningParenToken,
  isParenthesized,
} from "@eslint-community/eslint-utils";

/**
 * Get how many times the node is parenthesized.
 *
 * @param {import("eslint").Rule.Node} node - The node to check.
 * @param {import("eslint").SourceCode} sourceCode - The source code instance.
 * @returns {number} The number of pairs of parentheses around the node.
 */
function getParenthesizedTimes(node, sourceCode) {
  let times = 0;

  while (isParenthesized(times + 1, node, sourceCode)) {
    times++;
  }

  return times;
}

/**
 * Get all parentheses tokens around the node.
 *
 * @param {import("eslint").Rule.Node} node - The node to check.
 * @param {import("eslint").SourceCode} sourceCode - The source code instance.
 * @returns {Array.<import("eslint").AST.Token>} Parentheses tokens around the node.
 */
function getParentheses(node, sourceCode) {
  const count = getParenthesizedTimes(node, sourceCode);

  if (count === 0) {
    return [];
  }

  return [
    ...sourceCode.getTokensBefore(node, { count, filter: isOpeningParenToken }),
    ...sourceCode.getTokensAfter(node, { count, filter: isClosingParenToken }),
  ];
}

export { getParenthesizedTimes, getParentheses };

export { isParenthesized } from "@eslint-community/eslint-utils";
