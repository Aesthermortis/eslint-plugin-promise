/**
 * Rule: no-multiple-resolved
 * Disallow creating new promises with paths that resolve multiple times.
 */

import getDocsUrl from "./lib/get-docs-url.js";
import { isPromiseConstructorWithInlineExecutor } from "./lib/is-promise-constructor.js";

/**
 * @typedef {import("estree").Node} Node
 * @typedef {import("estree").Identifier} Identifier
 * @typedef {import("estree").FunctionExpression} FunctionExpression
 * @typedef {import("estree").ArrowFunctionExpression} ArrowFunctionExpression
 * @typedef {import("estree").SimpleCallExpression} CallExpression
 * @typedef {import("estree").MemberExpression} MemberExpression
 * @typedef {import("estree").NewExpression} NewExpression
 * @typedef {import("estree").ImportExpression} ImportExpression
 * @typedef {import("estree").YieldExpression} YieldExpression
 * @typedef {import("eslint").Rule.CodePath} CodePath
 * @typedef {import("eslint").Rule.CodePathSegment} CodePathSegment
 * @typedef {import("eslint").Rule.RuleContext} RuleContext
 * @typedef {import("eslint").Scope.Scope} Scope
 */

/**
 * An expression that can throw an error.
 *
 * @typedef {Node} ThrowableExpression
 * @see https://github.com/eslint/eslint/blob/e940be7a83d0caea15b64c1e1c2785a6540e2641/lib/linter/code-path-analysis/code-path-analyzer.js#L639-L643
 */

/**
 * A resolver call found earlier on the same code path.
 *
 * @typedef {object} AlreadyResolvedData
 * @property {Identifier} resolved - The resolver identifier that was already called.
 * @property {"certain" | "potential"} kind - Whether every path or only some paths already resolved.
 */

/**
 * Returns the function scope for a function node.
 *
 * @param {RuleContext} context - ESLint rule context.
 * @param {FunctionExpression | ArrowFunctionExpression} node - Function node whose scope should be read.
 * @returns {Scope} Scope associated with the function node.
 */
function getFunctionScope(context, node) {
  return context.sourceCode.scopeManager.acquire(node);
}

/**
 * Iterate all previous path segment routes.
 *
 * @param {CodePathSegment} segment - Segment whose previous routes should be traversed.
 * @returns {Iterable<CodePathSegment[]>} Previous routes ordered from nearest segment to route start.
 * @yields {CodePathSegment[]} A previous segment route.
 */
function* iterateAllPrevPathSegments(segment) {
  yield* iteratePrevPathSegments(segment, []);
}

/**
 * Iterate previous path segment routes while guarding against cycles.
 *
 * @param {CodePathSegment} segment - Segment whose previous routes should be traversed.
 * @param {CodePathSegment[]} processed - Segments already visited on the current traversal.
 * @returns {Iterable<CodePathSegment[]>} Previous routes ordered from nearest segment to route start.
 * @yields {CodePathSegment[]} A previous segment route.
 */
function* iteratePrevPathSegments(segment, processed) {
  if (processed.includes(segment)) {
    return;
  }
  const nextProcessed = [segment, ...processed];

  for (const prev of segment.prevSegments) {
    if (prev.prevSegments.length === 0) {
      yield [prev];
      continue;
    }
    for (const segments of iteratePrevPathSegments(prev, nextProcessed)) {
      yield [prev, ...segments];
    }
  }
}

/**
 * Iterate all next path segment routes.
 *
 * @param {CodePathSegment} segment - Segment whose next routes should be traversed.
 * @returns {Iterable<CodePathSegment[]>} Next routes ordered from nearest segment to route end.
 * @yields {CodePathSegment[]} A next segment route.
 */
function* iterateAllNextPathSegments(segment) {
  yield* iterateNextPathSegments(segment, []);
}

/**
 * Iterate next path segment routes while guarding against cycles.
 *
 * @param {CodePathSegment} segment - Segment whose next routes should be traversed.
 * @param {CodePathSegment[]} processed - Segments already visited on the current traversal.
 * @returns {Iterable<CodePathSegment[]>} Next routes ordered from nearest segment to route end.
 * @yields {CodePathSegment[]} A next segment route.
 */
function* iterateNextPathSegments(segment, processed) {
  if (processed.includes(segment)) {
    return;
  }
  const nextProcessed = [segment, ...processed];

  for (const next of segment.nextSegments) {
    if (next.nextSegments.length === 0) {
      yield [next];
      continue;
    }
    for (const segments of iterateNextPathSegments(next, nextProcessed)) {
      yield [next, ...segments];
    }
  }
}

/**
 * Finds segment intersections shared by all routes leading to a segment.
 *
 * @param {CodePathSegment} segment - Segment whose common previous route segments should be found.
 * @returns {Set<CodePathSegment>} Segments shared by every previous route.
 */
function getCommonPreviousRouteSegments(segment) {
  /** @type {Set<CodePathSegment>} */
  const routeSegments = new Set();

  for (const route of iterateAllPrevPathSegments(segment)) {
    if (routeSegments.size === 0) {
      for (const routeSegment of route) {
        routeSegments.add(routeSegment);
      }
      continue;
    }
    for (const routeSegment of routeSegments) {
      if (!route.includes(routeSegment)) {
        routeSegments.delete(routeSegment);
      }
    }
  }

  return routeSegments;
}

/**
 * Checks whether all routes from a route segment reach a target segment.
 *
 * @param {CodePathSegment} routeSegment - Segment to start route traversal from.
 * @param {CodePathSegment} targetSegment - Segment expected to appear in all forward routes.
 * @returns {boolean} Whether every forward route reaches the target segment.
 */
function everyRouteReachesSegment(routeSegment, targetSegment) {
  for (const segments of iterateAllNextPathSegments(routeSegment)) {
    if (!segments.includes(targetSegment)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks whether a throwable expression is inside a resolver call in a try block.
 *
 * @param {ThrowableExpression} expression - Throwable expression that may be inside a resolver call.
 * @param {Set<CallExpression>} resolverCalls - Resolver calls collected from the promise executor.
 * @param {Node} tryStatement - Try statement that owns the catch segment.
 * @returns {boolean} Whether the expression is inside a resolver call in the try block.
 */
function isExpressionInsideResolverCall(expression, resolverCalls, tryStatement) {
  for (const resolverCall of resolverCalls) {
    if (
      expression.range &&
      resolverCall.range &&
      tryStatement.range &&
      tryStatement.range[0] <= resolverCall.range[0] &&
      resolverCall.range[1] <= tryStatement.range[1] &&
      resolverCall.range[0] <= expression.range[0] &&
      expression.range[1] <= resolverCall.range[1]
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Finds the same route path from the given path following previous path segments.
 *
 * @param {CodePathSegment} segment - Segment whose same-route predecessor should be found.
 * @returns {CodePathSegment | null} The same-route segment when one exists.
 */
function findSameRoutePathSegment(segment) {
  for (const routeSegment of getCommonPreviousRouteSegments(segment)) {
    if (everyRouteReachesSegment(routeSegment, segment)) {
      return routeSegment;
    }
  }
  return null;
}

/**
 * Tracks resolver calls for one ESLint code path.
 */
class CodePathInfo {
  /** @param {CodePath} path - ESLint code path represented by this instance. */
  constructor(path) {
    this.path = path;
    /** @type {Map<CodePathSegment, CodePathSegmentInfo>} */
    this.segmentInfos = new Map();
    this.resolvedCount = 0;
    /** @type {Set<CodePathSegment>} */
    this.currentSegments = new Set();
  }

  /**
   * Marks a code path segment as currently active.
   *
   * @param {CodePathSegment} segment - Segment that is being entered.
   * @returns {void}
   */
  onSegmentEnter(segment) {
    this.currentSegments.add(segment);
  }

  /**
   * Marks a code path segment as no longer active.
   *
   * @param {CodePathSegment} segment - Segment that is being exited.
   * @returns {void}
   */
  onSegmentExit(segment) {
    this.currentSegments.delete(segment);
  }

  /**
   * Gets tracking data for all active code path segments.
   *
   * @returns {CodePathSegmentInfo[]} Tracking data for current segments.
   */
  getCurrentSegmentInfos() {
    return [...this.currentSegments].map((segment) => this._getOrCreateSegmentInfo(segment));
  }

  /**
   * Check all paths and return paths resolved multiple times.
   *
   * @param {PromiseCodePathContext} promiseCodePathContext - Promise-specific code path state.
   * @returns {Iterable<AlreadyResolvedData & { node: Identifier }>} Report data for duplicate resolver calls.
   * @yields {AlreadyResolvedData & { node: Identifier }} A duplicate resolver report.
   */
  *iterateReports(promiseCodePathContext) {
    const targets = [...this.segmentInfos.values()].filter((info) => info.resolved);
    for (const segmentInfo of targets) {
      const result = this._getAlreadyResolvedData(segmentInfo.segment, promiseCodePathContext);
      if (result) {
        yield {
          node: segmentInfo.resolved,
          resolved: result.resolved,
          kind: result.kind,
        };
      }
    }
  }

  /**
   * Gets already processed data for previous segments.
   *
   * @param {CodePathSegment} segment - Segment whose previous segments should be read.
   * @param {PromiseCodePathContext} promiseCodePathContext - Promise-specific code path state.
   * @returns {CodePathSegmentInfo[]} Processed previous segment data.
   */
  _getPreviousSegmentInfos(segment, promiseCodePathContext) {
    return segment.prevSegments
      .filter((prev) => !promiseCodePathContext.isResolvedTryBlockCodePathSegment(prev))
      .map((prev) => this._getProcessedSegmentInfo(prev, promiseCodePathContext));
  }

  /**
   * Computes a certain already-resolved result from previous segment data.
   *
   * @param {CodePathSegmentInfo[]} prevSegmentInfos - Previous segment tracking data.
   * @returns {AlreadyResolvedData | null} Certain resolved data, if all previous paths resolved.
   */
  _getCertainResolvedData(prevSegmentInfos) {
    if (prevSegmentInfos.length > 0 && prevSegmentInfos.every((info) => info.resolved)) {
      return {
        resolved: prevSegmentInfos[0].resolved,
        kind: "certain",
      };
    }
    return null;
  }

  /**
   * Checks whether a potentially resolved segment flows into the current resolver.
   *
   * @param {CodePathSegmentInfo} prevSegmentInfo - Previous segment tracking data.
   * @param {CodePathSegment} segment - Segment being evaluated.
   * @returns {boolean} Whether the previous potential resolver reaches the segment.
   */
  _isPotentialResolutionReachable(prevSegmentInfo, segment) {
    if (prevSegmentInfo.segment.nextSegments.length === 1) {
      return true;
    }

    const segmentInfo = this.segmentInfos.get(segment);
    if (!segmentInfo?.resolved) {
      return false;
    }

    return prevSegmentInfo.segment.nextSegments.every((next) => {
      const nextSegmentInfo = this.segmentInfos.get(next);
      return nextSegmentInfo?.resolved === segmentInfo.resolved;
    });
  }

  /**
   * Computes a potential already-resolved result from previous segment data.
   *
   * @param {CodePathSegmentInfo[]} prevSegmentInfos - Previous segment tracking data.
   * @param {CodePathSegment} segment - Segment being evaluated.
   * @returns {AlreadyResolvedData | null} Potential resolved data, if one previous path resolved.
   */
  _getPotentialResolvedData(prevSegmentInfos, segment) {
    for (const prevSegmentInfo of prevSegmentInfos) {
      if (prevSegmentInfo.resolved) {
        return {
          resolved: prevSegmentInfo.resolved,
          kind: "potential",
        };
      }
      if (
        prevSegmentInfo.potentiallyResolved &&
        this._isPotentialResolutionReachable(prevSegmentInfo, segment)
      ) {
        return {
          resolved: prevSegmentInfo.potentiallyResolved,
          kind: "potential",
        };
      }
    }
    return null;
  }

  /**
   * Computes a potential already-resolved result from a same-route segment.
   *
   * @param {CodePathSegment} segment - Segment being evaluated.
   * @param {PromiseCodePathContext} promiseCodePathContext - Promise-specific code path state.
   * @returns {AlreadyResolvedData | null} Potential resolved data from a same-route segment.
   */
  _getSameRouteResolvedData(segment, promiseCodePathContext) {
    const sameRoute = findSameRoutePathSegment(segment);
    if (!sameRoute) {
      return null;
    }

    const sameRouteSegmentInfo = this._getProcessedSegmentInfo(sameRoute, promiseCodePathContext);
    if (!sameRouteSegmentInfo.potentiallyResolved) {
      return null;
    }

    return {
      resolved: sameRouteSegmentInfo.potentiallyResolved,
      kind: "potential",
    };
  }

  /**
   * Compute the previously resolved path.
   *
   * @param {CodePathSegment} segment - Segment being evaluated.
   * @param {PromiseCodePathContext} promiseCodePathContext - Promise-specific code path state.
   * @returns {AlreadyResolvedData | null} Already-resolved data when a resolver reaches this segment.
   */
  _getAlreadyResolvedData(segment, promiseCodePathContext) {
    const prevSegmentInfos = this._getPreviousSegmentInfos(segment, promiseCodePathContext);

    return (
      this._getCertainResolvedData(prevSegmentInfos) ??
      this._getPotentialResolvedData(prevSegmentInfos, segment) ??
      this._getSameRouteResolvedData(segment, promiseCodePathContext)
    );
  }

  /**
   * Gets processed tracking data for a code path segment.
   *
   * @param {CodePathSegment} segment - Segment whose tracking data should be read.
   * @param {PromiseCodePathContext} promiseCodePathContext - Promise-specific code path state.
   * @returns {CodePathSegmentInfo} Tracking data for the segment.
   */
  _getProcessedSegmentInfo(segment, promiseCodePathContext) {
    const segmentInfo = this.segmentInfos.get(segment);
    if (segmentInfo) {
      return segmentInfo;
    }
    const newInfo = this._getOrCreateSegmentInfo(segment);

    const alreadyResolvedData = this._getAlreadyResolvedData(segment, promiseCodePathContext);
    if (alreadyResolvedData?.kind === "certain") {
      newInfo.resolved = alreadyResolvedData.resolved;
    } else if (alreadyResolvedData) {
      newInfo.potentiallyResolved = alreadyResolvedData.resolved;
    }
    return newInfo;
  }

  /**
   * Gets existing tracking data or creates a new tracker for a segment.
   *
   * @param {CodePathSegment} segment - Segment whose tracking data should be read.
   * @returns {CodePathSegmentInfo} Tracking data for the segment.
   */
  _getOrCreateSegmentInfo(segment) {
    const segmentInfo = this.segmentInfos.get(segment);
    if (segmentInfo) {
      return segmentInfo;
    }

    const newInfo = new CodePathSegmentInfo(this, segment);
    this.segmentInfos.set(segment, newInfo);
    return newInfo;
  }
}

/**
 * Resolver data for a single ESLint code path segment.
 */
class CodePathSegmentInfo {
  /**
   * @param {CodePathInfo} pathInfo - Code path info that owns this segment.
   * @param {CodePathSegment} segment - Segment represented by this instance.
   */
  constructor(pathInfo, segment) {
    this.pathInfo = pathInfo;
    this.segment = segment;
    /** @type {Identifier | null} */
    this._resolved = null;
    /** @type {Identifier | null} */
    this.potentiallyResolved = null;
  }

  /**
   * Resolver identifier certainly called on this segment.
   *
   * @returns {Identifier | null} Resolver identifier when this segment is resolved.
   */
  get resolved() {
    return this._resolved;
  }

  /**
   * Stores the resolver identifier certainly called on this segment.
   *
   * @param {Identifier} identifier - Resolver identifier found on the segment.
   */
  set resolved(identifier) {
    this._resolved = identifier;
    this.pathInfo.resolvedCount++;
  }
}

/**
 * Promise-specific code path state.
 */
class PromiseCodePathContext {
  constructor() {
    /** @type {Set<string>} */
    this.resolvedSegmentIds = new Set();
  }

  /**
   * Marks a try-block segment that ended with a resolver call.
   *
   * @param {CodePathSegment} segment - Segment to mark.
   * @returns {void}
   */
  addResolvedTryBlockCodePathSegment(segment) {
    this.resolvedSegmentIds.add(segment.id);
  }

  /**
   * Checks whether a segment belongs to a try block that ended with a resolver call.
   *
   * @param {CodePathSegment} segment - Segment to check.
   * @returns {boolean} Whether the segment should be ignored as already handled by try/catch flow.
   */
  isResolvedTryBlockCodePathSegment(segment) {
    return this.resolvedSegmentIds.has(segment.id);
  }
}

export default {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow creating new promises with paths that resolve multiple times.",
      url: getDocsUrl("no-multiple-resolved"),
    },
    messages: {
      alreadyResolved:
        "Promise should not be resolved multiple times. Promise is already resolved on line {{line}}.",
      potentiallyAlreadyResolved:
        "Promise should not be resolved multiple times. Promise is potentially resolved on line {{line}}.",
    },
    schema: [],
  },

  /**
   * Creates listeners for the rule.
   *
   * @param {RuleContext} context - ESLint rule context.
   * @returns {import("eslint").Rule.RuleListener} Rule visitor callbacks.
   */
  create(context) {
    const reported = new Set();
    const promiseCodePathContext = new PromiseCodePathContext();

    /**
     * Reports a duplicate resolver call once.
     *
     * @param {Identifier} node - Resolver identifier that resolves again.
     * @param {Identifier} resolved - Previous resolver identifier.
     * @param {"certain" | "potential"} kind - Whether the previous resolution is certain or potential.
     * @returns {void}
     */
    function report(node, resolved, kind) {
      if (reported.has(node)) {
        return;
      }
      reported.add(node);
      context.report({
        node: node.parent,
        messageId: kind === "certain" ? "alreadyResolved" : "potentiallyAlreadyResolved",
        data: {
          line: resolved.loc.start.line,
        },
      });
    }

    /**
     * Verifies resolver calls recorded for a completed code path.
     *
     * @param {CodePathInfo} codePathInfo - Code path data to verify.
     * @param {PromiseCodePathContext} promiseCodePathContext - Promise-specific code path state.
     * @returns {void}
     */
    function verifyMultipleResolvedPath(codePathInfo, promiseCodePathContext) {
      for (const { node, resolved, kind } of codePathInfo.iterateReports(promiseCodePathContext)) {
        report(node, resolved, kind);
      }
    }

    /**
     * Records a resolver call and reports already resolved paths.
     *
     * @param {Identifier} node - Resolver identifier used as a call callee.
     * @param {CallExpression} callExpression - Resolver call expression.
     * @returns {void}
     */
    function processResolverCall(node, callExpression) {
      const codePathInfo = codePathInfoStack[0];
      resolverCallsStack[0].add(callExpression);
      for (const segmentInfo of codePathInfo.getCurrentSegmentInfos()) {
        if (segmentInfo.resolved) {
          report(node, segmentInfo.resolved, "certain");
          continue;
        }
        segmentInfo.resolved = node;
      }
    }

    /** @type {CodePathInfo[]} */
    const codePathInfoStack = [];
    /** @type {Set<Identifier>[]} */
    const resolverReferencesStack = [new Set()];
    /** @type {Set<CallExpression>[]} */
    const resolverCallsStack = [new Set()];
    /** @type {ThrowableExpression | null} */
    let lastThrowableExpression = null;
    return {
      /**
       * Collects resolver references for promise executor functions.
       *
       * @param {FunctionExpression | ArrowFunctionExpression} node - Function node being entered.
       * @returns {void}
       */
      "FunctionExpression, ArrowFunctionExpression"(node) {
        if (!isPromiseConstructorWithInlineExecutor(node.parent)) {
          return;
        }
        /** @type {Set<Identifier>} */
        const resolverReferences = new Set();
        const resolvers = node.params.filter(
          /**
           * Checks whether a function parameter is an identifier resolver.
           *
           * @param {Node} node - Function parameter node.
           * @returns {node is Identifier} Whether the parameter is an identifier.
           */
          (node) => node && node.type === "Identifier",
        );
        const functionScope = getFunctionScope(context, node);
        for (const resolver of resolvers) {
          const variable = functionScope.set.get(resolver.name);
          // istanbul ignore next -- Usually always present.
          if (!variable) continue;
          for (const reference of variable.references) {
            resolverReferences.add(reference.identifier);
          }
        }

        resolverReferencesStack.unshift(resolverReferences);
        resolverCallsStack.unshift(new Set());
      },

      /**
       * Pops resolver references for promise executor functions.
       *
       * @param {FunctionExpression | ArrowFunctionExpression} node - Function node being exited.
       * @returns {void}
       */
      "FunctionExpression, ArrowFunctionExpression:exit"(node) {
        if (!isPromiseConstructorWithInlineExecutor(node.parent)) {
          return;
        }
        resolverReferencesStack.shift();
        resolverCallsStack.shift();
      },

      /**
       * Starts tracking an ESLint code path.
       *
       * @param {CodePath} path - Code path being entered.
       * @returns {void}
       */
      onCodePathStart(path) {
        codePathInfoStack.unshift(new CodePathInfo(path));
      },

      /**
       * Verifies and pops a completed ESLint code path.
       *
       * @returns {void}
       */
      onCodePathEnd() {
        const codePathInfo = codePathInfoStack.shift();
        if (codePathInfo.resolvedCount > 1) {
          verifyMultipleResolvedPath(codePathInfo, promiseCodePathContext);
        }
      },

      /**
       * Records the last expression that can throw.
       *
       * @param {ThrowableExpression} node - Throwable expression being exited.
       * @returns {void}
       */
      "CallExpression, MemberExpression, NewExpression, ImportExpression, YieldExpression:exit"(
        node,
      ) {
        lastThrowableExpression = node;
        if (
          node.type === "CallExpression" &&
          node.callee.type === "Identifier" &&
          resolverReferencesStack[0].has(node.callee)
        ) {
          processResolverCall(node.callee, node);
        }
      },

      /**
       * Marks a code path segment as active.
       *
       * @param {CodePathSegment} segment - Segment being entered.
       * @returns {void}
       */
      onCodePathSegmentStart(segment) {
        codePathInfoStack[0].onSegmentEnter(segment);
      },

      /**
       * Marks an unreachable code path segment as active.
       *
       * @param {CodePathSegment} segment - Segment being entered.
       * @returns {void}
       */
      /* istanbul ignore next -- It is not called in ESLint v7. */
      onUnreachableCodePathSegmentStart(segment) {
        codePathInfoStack[0].onSegmentEnter(segment);
      },

      /**
       * Marks try-block resolver segments and exits a code path segment.
       *
       * @param {CodePathSegment} segment - Segment being exited.
       * @param {Node} node - AST node associated with the segment end.
       * @returns {void}
       */
      onCodePathSegmentEnd(segment, node) {
        if (
          node.type === "CatchClause" &&
          lastThrowableExpression &&
          node.parent.type === "TryStatement" &&
          node.parent.range[0] <= lastThrowableExpression.range[0] &&
          lastThrowableExpression.range[1] <= node.parent.range[1] &&
          isExpressionInsideResolverCall(
            lastThrowableExpression,
            resolverCallsStack[0],
            node.parent,
          )
        ) {
          promiseCodePathContext.addResolvedTryBlockCodePathSegment(segment);
        }
        codePathInfoStack[0].onSegmentExit(segment);
      },

      /**
       * Marks an unreachable code path segment as inactive.
       *
       * @param {CodePathSegment} segment - Segment being exited.
       * @returns {void}
       */
      /* istanbul ignore next -- It is not called in ESLint v7. */
      onUnreachableCodePathSegmentEnd(segment) {
        codePathInfoStack[0].onSegmentExit(segment);
      },
    };
  },
};
