# eslint-plugin-promise

Enforce best practices for JavaScript promises.

[![CI](https://github.com/Aesthermortis/eslint-plugin-promise/actions/workflows/ci.yml/badge.svg)](https://github.com/Aesthermortis/eslint-plugin-promise/actions/workflows/ci.yml)
[![ESLint](https://img.shields.io/badge/lint-ESLint-4B32C3.svg)](https://eslint.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Rules](#rules)

## Installation

Install ESLint and `eslint-plugin-promise` as development dependencies:

```sh
npm i -D eslint github:Aesthermortis/eslint-plugin-promise
```

## Usage

Use the recommended configuration in `eslint.config.js`:

```js
import pluginPromise from "eslint-plugin-promise";

export default [pluginPromise.configs.recommended];
```

You can also configure individual rules manually:

```js
import pluginPromise from "eslint-plugin-promise";

export default [
  {
    plugins: {
      promise: pluginPromise,
    },
    rules: {
      "promise/always-return": "error",
      "promise/no-return-wrap": "error",
      "promise/param-names": "error",
      "promise/catch-or-return": "error",
      "promise/no-new-statics": "error",
      "promise/no-multiple-resolved": "error",
    },
  },
];
```

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
⚠️ Configurations set to warn in.\
🚫 Configurations disabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                 | Description                                                                                | 💼  | ⚠️  | 🚫  | 🔧  |
| :------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- | :-- | :-- | :-- | :-- |
| [always-return](docs/rules/always-return.md)                         | Require returning inside each `then()` to create readable and reusable Promise chains.     | ✅  |     |     |     |
| [avoid-new](docs/rules/avoid-new.md)                                 | Disallow creating `new` promises outside of utility libs (use [util.promisify][] instead). |     |     | ✅  |     |
| [catch-or-return](docs/rules/catch-or-return.md)                     | Enforce the use of `catch()` on un-returned promises.                                      | ✅  |     |     |     |
| [no-callback-in-promise](docs/rules/no-callback-in-promise.md)       | Disallow calling `cb()` inside of a `then()` (use [util.callbackify][] instead).           |     | ✅  |     |     |
| [no-multiple-resolved](docs/rules/no-multiple-resolved.md)           | Disallow creating new promises with paths that resolve multiple times.                     |     |     |     |     |
| [no-native](docs/rules/no-native.md)                                 | Require creating a `Promise` constructor before using it in an ES5 environment.            |     |     | ✅  |     |
| [no-nesting](docs/rules/no-nesting.md)                               | Disallow nested `then()` or `catch()` statements.                                          |     | ✅  |     |     |
| [no-new-statics](docs/rules/no-new-statics.md)                       | Disallow calling `new` on a Promise static method.                                         | ✅  |     |     | 🔧  |
| [no-promise-in-callback](docs/rules/no-promise-in-callback.md)       | Disallow using promises inside of callbacks.                                               |     | ✅  |     |     |
| [no-return-in-finally](docs/rules/no-return-in-finally.md)           | Disallow return statements in `finally()`.                                                 |     | ✅  |     |     |
| [no-return-wrap](docs/rules/no-return-wrap.md)                       | Disallow wrapping values in `Promise.resolve` or `Promise.reject` when not needed.         | ✅  |     |     |     |
| [param-names](docs/rules/param-names.md)                             | Enforce consistent param names and ordering when creating new promises.                    | ✅  |     |     |     |
| [prefer-await-to-callbacks](docs/rules/prefer-await-to-callbacks.md) | Prefer `async`/`await` to the callback pattern.                                            |     |     |     |     |
| [prefer-await-to-then](docs/rules/prefer-await-to-then.md)           | Prefer `await` to `then()`/`catch()`/`finally()` for reading Promise values.               |     |     |     |     |
| [prefer-catch](docs/rules/prefer-catch.md)                           | Prefer `catch` to `then(a, b)`/`then(null, b)` for handling errors.                        |     |     |     | 🔧  |
| [spec-only](docs/rules/spec-only.md)                                 | Disallow use of non-standard Promise static methods.                                       |     |     |     |     |
| [valid-params](docs/rules/valid-params.md)                           | Enforces the proper number of arguments are passed to Promise functions.                   |     | ✅  |     |     |

<!-- end auto-generated rules list -->

[util.callbackify]: https://nodejs.org/docs/latest/api/util.html#utilcallbackifyoriginal
[util.promisify]: https://nodejs.org/api/util.html#util_util_promisify_original
