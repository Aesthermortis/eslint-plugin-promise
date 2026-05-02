import alwaysReturn from "./always-return.js";
import avoidNew from "./avoid-new.js";
import catchOrReturn from "./catch-or-return.js";
import noCallbackInPromise from "./no-callback-in-promise.js";
import noMultipleResolved from "./no-multiple-resolved.js";
import noNative from "./no-native.js";
import noNesting from "./no-nesting.js";
import noNewStatics from "./no-new-statics.js";
import noPromiseInCallback from "./no-promise-in-callback.js";
import noReturnInFinally from "./no-return-in-finally.js";
import noReturnWrap from "./no-return-wrap.js";
import paramNames from "./param-names.js";
import preferAwaitToCallbacks from "./prefer-await-to-callbacks.js";
import preferAwaitToThen from "./prefer-await-to-then.js";
import preferCatch from "./prefer-catch.js";
import specOnly from "./spec-only.js";
import validParams from "./valid-params.js";

/** @type {Record<string, import("eslint").Rule.RuleModule>} */
const rules = {
  "always-return": alwaysReturn,
  "avoid-new": avoidNew,
  "catch-or-return": catchOrReturn,
  "no-callback-in-promise": noCallbackInPromise,
  "no-multiple-resolved": noMultipleResolved,
  "no-native": noNative,
  "no-nesting": noNesting,
  "no-new-statics": noNewStatics,
  "no-promise-in-callback": noPromiseInCallback,
  "no-return-in-finally": noReturnInFinally,
  "no-return-wrap": noReturnWrap,
  "param-names": paramNames,
  "prefer-await-to-callbacks": preferAwaitToCallbacks,
  "prefer-await-to-then": preferAwaitToThen,
  "prefer-catch": preferCatch,
  "spec-only": specOnly,
  "valid-params": validParams,
};

export default rules;
