import getDocsUrl from "./lib/get-docs-url.js";
/**
 * @typedef {import("estree").Node} Node
 * @typedef {import("estree").SimpleCallExpression} CallExpression
 * @typedef {import("estree").FunctionExpression} FunctionExpression
 * @typedef {import("estree").ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {import("eslint").Rule.CodePath} CodePath
 * @typedef {import("eslint").Rule.CodePathSegment} CodePathSegment
 */

/** @typedef {(FunctionExpression | ArrowFunctionExpression) & { parent: CallExpression }} InlineThenFunctionExpression */

/**
 * @param {Node} node Node to check.
 * @returns {boolean} Whether the node is a function with a block body.
 */
function isFunctionWithBlockStatement(node) {
  if (node.type === "FunctionExpression") {
    return true;
  }
  if (node.type === "ArrowFunctionExpression") {
    return node.body.type === "BlockStatement";
  }
  return false;
}

/**
 * @param {string} memberName Member name to match.
 * @param {Node} node Node to check.
 * @returns {node is CallExpression} Whether the node is a call to the member.
 */
function isMemberCall(memberName, node) {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    !node.callee.computed &&
    node.callee.property.type === "Identifier" &&
    node.callee.property.name === memberName
  );
}

/**
 * @param {Node} node Node to check.
 * @returns {boolean} Whether the node is the first argument of its parent call.
 */
function isFirstArgument(node) {
  return Boolean(node.parent && node.parent.arguments && node.parent.arguments[0] === node);
}

/**
 * @param {Node} node Node to check.
 * @returns {node is InlineThenFunctionExpression} Whether the node is the first inline `then()` callback.
 */
function isInlineThenFunctionExpression(node) {
  return (
    isFunctionWithBlockStatement(node) && isMemberCall("then", node.parent) && isFirstArgument(node)
  );
}

/**
 * Gets the next node to inspect while walking a promise chain.
 *
 * @param {Node} parent Parent node currently wrapping the target.
 * @param {Node} target Node currently being inspected.
 * @returns {Node | null} Next node to inspect, or `null` when the chain ends.
 */
function getNextPromiseTarget(parent, target) {
  switch (parent.type) {
    case "SequenceExpression": {
      if (peek(parent.expressions) !== target) {
        // e.g. (promise?.then(() => value), expr)
        return null;
      }
      return parent;
    }
    case "ChainExpression":
    case "AwaitExpression": {
      return parent;
    }
    case "MemberExpression": {
      if (
        parent.parent &&
        (isMemberCall("catch", parent.parent) || isMemberCall("finally", parent.parent))
      ) {
        // e.g. promise.then(() => value).catch(e => {})
        return parent.parent;
      }
      return null;
    }
    default: {
      return null;
    }
  }
}

/**
 * Checks whether the given node is the last `then()` callback in a promise chain.
 *
 * @param {InlineThenFunctionExpression} node Callback node to check.
 * @returns {boolean} Whether the callback is the last relevant callback in the chain.
 */
function isLastCallback(node) {
  /** @type {Node} */
  let target = node.parent;
  /** @type {Node | undefined} */
  let parent = target.parent;
  while (parent) {
    if (parent.type === "ExpressionStatement") {
      // e.g. { promise.then(() => value) }
      return true;
    }
    if (parent.type === "UnaryExpression") {
      // e.g. void promise.then(() => value)
      return parent.operator === "void";
    }
    const nextTarget = getNextPromiseTarget(parent, target);
    if (parent.type === "SequenceExpression" && nextTarget === null) {
      return true;
    }
    if (nextTarget) {
      target = nextTarget;
      parent = target.parent;
      continue;
    }
    return false;
  }

  // istanbul ignore next
  return false;
}

/**
 * @param {T[]} arr Non-empty array to read.
 * @returns {T} Last array item.
 * @template T
 */
function peek(arr) {
  return arr.at(-1);
}

/**
 * Gets the root object name for a MemberExpression or Identifier.
 *
 * @param {Node} node Node to inspect.
 * @returns {string | undefined} Root object name when it can be resolved.
 */
function getRootObjectName(node) {
  if (node.type === "Identifier") {
    return node.name;
  }
  // istanbul ignore else (fallback)
  if (node.type === "MemberExpression") {
    return getRootObjectName(node.object);
  }
}

/**
 * Checks if the node is an assignment to an ignored variable.
 *
 * @param {Node} node Node to inspect.
 * @param {string[]} ignoredVars Ignored variable root names.
 * @returns {boolean} Whether the node assigns to an ignored variable.
 */
function isIgnoredAssignment(node, ignoredVars) {
  if (node.type !== "ExpressionStatement") return false;
  const expr = node.expression;
  if (expr.type !== "AssignmentExpression") return false;
  const left = expr.left;
  const rootName = getRootObjectName(left);
  return ignoredVars.includes(rootName);
}

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require returning inside each `then()` to create readable and reusable Promise chains.",
      url: getDocsUrl("always-return"),
    },
    schema: [
      {
        type: "object",
        properties: {
          ignoreLastCallback: {
            type: "boolean",
            description: "Whether to allow the final callback in a promise chain to omit a return.",
          },
          ignoreAssignmentVariable: {
            type: "array",
            description:
              "Variable roots that may be assigned in the last callback without returning.",
            items: {
              type: "string",
              pattern: String.raw`^[\w$]+$`,
            },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        ignoreLastCallback: false,
        ignoreAssignmentVariable: ["globalThis"],
      },
    ],
    messages: {
      thenShouldReturnOrThrow: "Each then() should return a value or throw",
    },
  },
  create(context) {
    const [{ ignoreAssignmentVariable, ignoreLastCallback }] = context.options;

    /**
     * @typedef {object} BranchInfo
     * @property {boolean} good This is a boolean representing whether the given branch explicitly `return`s or
     *                          `throw`s. It starts as `false`
     *                          for every branch and is updated to `true` if a `return` or `throw`
     *                          statement is found.
     * @property {Node} node This is a estree Node object for the given branch.
     */

    /**
     * @typedef {object} FuncInfo
     * @property {string[]} branchIDStack This is a stack representing the currently executing branches
     *                                    ("codePathSegment"s) within the given function.
     * @property {Map<string, BranchInfo>} branchInfoMap This is a map representing information about all branches
     *                                                   within the given function.
     */

    /**
     * funcInfoStack is a stack representing the stack of currently executing functions example:
     * funcInfoStack = [ { branchIDStack: [ 's1_1' ],
     * branchInfoMap:
     * { s1_1:
     * { good: false,
     * loc: <loc> } } },
     * { branchIDStack: ['s2_1', 's2_4'],
     * branchInfoMap:
     * { s2_1:
     * { good: false,
     * loc: <loc> },
     * s2_2:
     * { good: true,
     * loc: <loc> },
     * s2_4:
     * { good: false,
     * loc: <loc> } } } ]
     *
     * @type {FuncInfo[]}
     */
    const funcInfoStack = [];

    /** Marks the current branch as having an explicit exit. */
    function markCurrentBranchAsGood() {
      const funcInfo = peek(funcInfoStack);
      const currentBranchID = peek(funcInfo.branchIDStack);
      const branchInfo = funcInfo.branchInfoMap.get(currentBranchID);
      if (branchInfo) {
        branchInfo.good = true;
      }
      // else unreachable code
    }

    return {
      "ReturnStatement:exit": markCurrentBranchAsGood,
      "ThrowStatement:exit": markCurrentBranchAsGood,
      'ExpressionStatement > CallExpression > MemberExpression[object.name="process"][property.name="exit"]:exit':
        markCurrentBranchAsGood,
      'ExpressionStatement > CallExpression > MemberExpression[object.name="process"][property.name="abort"]:exit':
        markCurrentBranchAsGood,

      /**
       * @param {CodePathSegment} segment Code path segment that started.
       * @param {Node} node Node associated with the segment.
       */
      onCodePathSegmentStart(segment, node) {
        const funcInfo = peek(funcInfoStack);
        funcInfo.branchIDStack.push(segment.id);
        funcInfo.branchInfoMap.set(segment.id, { good: false, node });
      },

      onCodePathSegmentEnd() {
        const funcInfo = peek(funcInfoStack);
        funcInfo.branchIDStack.pop();
      },

      onCodePathStart() {
        funcInfoStack.push({
          branchIDStack: [],
          branchInfoMap: new Map(),
        });
      },

      /**
       * @param {CodePath} path Completed code path.
       * @param {Node} node Node associated with the completed code path.
       */
      onCodePathEnd(path, node) {
        const funcInfo = funcInfoStack.pop();

        if (!isInlineThenFunctionExpression(node)) {
          return;
        }

        if (ignoreLastCallback && isLastCallback(node)) {
          return;
        }

        if (
          ignoreAssignmentVariable.length > 0 &&
          isLastCallback(node) &&
          node.body?.type === "BlockStatement"
        ) {
          for (const statement of node.body.body) {
            if (isIgnoredAssignment(statement, ignoreAssignmentVariable)) {
              return;
            }
          }
        }

        for (const segment of path.finalSegments) {
          const branch = funcInfo.branchInfoMap.get(segment.id);
          if (branch && !branch.good) {
            context.report({
              messageId: "thenShouldReturnOrThrow",
              node: branch.node,
            });
          }
        }
      },
    };
  },
};
