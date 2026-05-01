import alwaysReturn from "./rules/always-return.js";
import avoidNew from "./rules/avoid-new.js";
import catchOrReturn from "./rules/catch-or-return.js";
import noCallbackInPromise from "./rules/no-callback-in-promise.js";
import noMultipleResolved from "./rules/no-multiple-resolved.js";
import noNative from "./rules/no-native.js";
import noNesting from "./rules/no-nesting.js";
import noNewStatics from "./rules/no-new-statics.js";
import noPromiseInCallback from "./rules/no-promise-in-callback.js";
import noReturnInFinally from "./rules/no-return-in-finally.js";
import noReturnWrap from "./rules/no-return-wrap.js";
import paramNames from "./rules/param-names.js";
import preferAwaitToCallbacks from "./rules/prefer-await-to-callbacks.js";
import preferAwaitToThen from "./rules/prefer-await-to-then.js";
import preferCatch from "./rules/prefer-catch.js";
import specOnly from "./rules/spec-only.js";
import validParams from "./rules/valid-params.js";

/** @type {Record<string, import("eslint").Linter.RuleSeverity>} */
const recommendedRules = {
  "promise/always-return": "error",
  "promise/no-return-wrap": "error",
  "promise/param-names": "error",
  "promise/catch-or-return": "error",
  "promise/no-native": "off",
  "promise/no-nesting": "warn",
  "promise/no-promise-in-callback": "warn",
  "promise/no-callback-in-promise": "warn",
  "promise/avoid-new": "off",
  "promise/no-new-statics": "error",
  "promise/no-return-in-finally": "warn",
  "promise/valid-params": "warn",
};

export const rules = {
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

/** @type {import("eslint").ESLint.Plugin} */
const pluginPromise = {
  rules,
};

export const configs = {
  recommended: {
    name: "promise/recommended",
    plugins: { promise: pluginPromise },
    rules: recommendedRules,
  },
};

pluginPromise.configs = configs;

export default pluginPromise;
