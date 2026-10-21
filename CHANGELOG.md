# Changelog

## [9.0.0](https://github.com/Aesthermortis/eslint-plugin-promise/compare/v8.0.0...v9.0.0) (2026-05-15)


### ⚠ BREAKING CHANGES

* **api:** named configs and rules exports are no longer available. Use the default plugin export instead.

### 🌟 Features

* **configs:** add all rules config ([f702886](https://github.com/Aesthermortis/eslint-plugin-promise/commit/f7028865e21b42086e0af658a7129a1f2c38d908))


### 🩹 Fixes

* **types:** cast callback ancestors ([7ca09dd](https://github.com/Aesthermortis/eslint-plugin-promise/commit/7ca09dd351237ba54254cf8891c37c1c20db4b9e))
* **types:** guard avoid-new constructor callee ([807f460](https://github.com/Aesthermortis/eslint-plugin-promise/commit/807f4604227311aa976000f6cb8ba750d1f083a0))
* **types:** guard callback helper nodes ([b2a1f3b](https://github.com/Aesthermortis/eslint-plugin-promise/commit/b2a1f3beb7febdcd6d1c04be67bee356c2c47dc4))
* **types:** guard catch-or-return member checks ([715796d](https://github.com/Aesthermortis/eslint-plugin-promise/commit/715796d24fe2c4cee323a425c146291d45ec2529))
* **types:** guard finally callback checks ([dcb8318](https://github.com/Aesthermortis/eslint-plugin-promise/commit/dcb831848fe6d754cd2b107edcd76e084fae74cd))
* **types:** guard no-nesting report target ([860da04](https://github.com/Aesthermortis/eslint-plugin-promise/commit/860da049d32ac38fa74c9a0a1946e6b8c88c8818))
* **types:** guard promise callback properties ([b722731](https://github.com/Aesthermortis/eslint-plugin-promise/commit/b72273181387590feb30d8816fb5bed7360a92c8))
* **types:** guard promise member detection ([036a4be](https://github.com/Aesthermortis/eslint-plugin-promise/commit/036a4bec64eb5a5e8a465739fca15717a979d7c3))
* **types:** guard promise parameter names ([7a40ade](https://github.com/Aesthermortis/eslint-plugin-promise/commit/7a40ade5b01f3ced5a38eea9621ce537cdf9cf8c))
* **types:** guard promise static names ([4e78941](https://github.com/Aesthermortis/eslint-plugin-promise/commit/4e7894188887e576026a5d1158f62dcbae9a4d81))
* **types:** guard resolver parent lookups ([ac59144](https://github.com/Aesthermortis/eslint-plugin-promise/commit/ac59144db248e5b3b3cee028f3e6ebcdee7e2a8e))
* **types:** guard return wrap promise checks ([092b630](https://github.com/Aesthermortis/eslint-plugin-promise/commit/092b6301436d200655e8091a95d3dbe4dad0b81a))
* **types:** guard spec-only property names ([6cff9b2](https://github.com/Aesthermortis/eslint-plugin-promise/commit/6cff9b2d382d4f12e71b7805e42cbb447caf9fe7))
* **types:** guard valid params method names ([cdfa765](https://github.com/Aesthermortis/eslint-plugin-promise/commit/cdfa765171a5a462f0f74647a51d2d66d6235a65))
* **types:** narrow callback function params ([672cab3](https://github.com/Aesthermortis/eslint-plugin-promise/commit/672cab35735d06407d8bbac442c68265e91e433a))
* **types:** narrow callback-in-promise AST checks ([1343e99](https://github.com/Aesthermortis/eslint-plugin-promise/commit/1343e9963023d73a8074730f604669cd59a24326))
* **types:** narrow promise callback parents ([4342eac](https://github.com/Aesthermortis/eslint-plugin-promise/commit/4342eacbd20eb6d142a4e9364eac9f98b29e2c89))
* **types:** type always-return parent traversal ([1ffdd36](https://github.com/Aesthermortis/eslint-plugin-promise/commit/1ffdd3654436b02505585c6f312a67fde9533942))
* **types:** type callback call helpers ([6c2a060](https://github.com/Aesthermortis/eslint-plugin-promise/commit/6c2a0600aeab8fcd60687718574a2c4f58d22d1d))
* **types:** type removable fixer arguments ([1b13ae6](https://github.com/Aesthermortis/eslint-plugin-promise/commit/1b13ae61f48b6b323242f1b4ca66ef21416686d9))


### 📚 Documentation

* **readme:** clarify installation instructions ([61eaa3d](https://github.com/Aesthermortis/eslint-plugin-promise/commit/61eaa3d2e0741d9353145e2f68168a679e37a213))
* **readme:** update CI badge to point to validate workflow ([ccc4395](https://github.com/Aesthermortis/eslint-plugin-promise/commit/ccc4395b302323a9a098679222637df6ceeeb2fd))
* **rules:** regenerate all config markers ([30e3928](https://github.com/Aesthermortis/eslint-plugin-promise/commit/30e39286c58d8b82f7cfc2e9b5be523112599b9d))


### 🧹 Chores

* **api:** expose plugin through default export ([2e7b0c5](https://github.com/Aesthermortis/eslint-plugin-promise/commit/2e7b0c55aa3e0dad5446ad58265b7f8e6988b74b))
* **config:** extract recommended rules config ([66057b5](https://github.com/Aesthermortis/eslint-plugin-promise/commit/66057b5077d210f3efbcfaa68a51a64029676c24))
* **configs:** cover plugin configs and rule metadata ([e3f8456](https://github.com/Aesthermortis/eslint-plugin-promise/commit/e3f84562e47a2bcd151613fb4c917e0e8d496c5d))
* **coverage:** cover callback callee variants ([940ee76](https://github.com/Aesthermortis/eslint-plugin-promise/commit/940ee76e4fab53e910a656265f5f09e7e2c34b9e))
* **coverage:** cover param-names destructured params ([32664ad](https://github.com/Aesthermortis/eslint-plugin-promise/commit/32664adcb6173f3e352fe3d37cf9f80a239daa7a))
* **coverage:** cover spec-only unknown properties ([22c97c8](https://github.com/Aesthermortis/eslint-plugin-promise/commit/22c97c8dc02b13e84b39dd237fa994b8d8272bbd))
* **coverage:** cover valid-params chain extensions ([0fadf7f](https://github.com/Aesthermortis/eslint-plugin-promise/commit/0fadf7f14b51136f2e5ffeb9c5be8b32a8384e6b))
* **coverage:** ignore no-return-wrap parent fallback ([2635b91](https://github.com/Aesthermortis/eslint-plugin-promise/commit/2635b91e7fe7dc58a3e45055b7fcb1d3f2422f53))
* **coverage:** ignore unreachable always-return fallback ([16d1702](https://github.com/Aesthermortis/eslint-plugin-promise/commit/16d17020ccd4d20db932e184b20a602e84bb1b9c))
* **coverage:** ignore unreachable resolver fallbacks ([b73b649](https://github.com/Aesthermortis/eslint-plugin-promise/commit/b73b649657b8412cc8560454a9a11d4d56ea70b9))
* **dependabot:** simplify update config and labels ([88cfa03](https://github.com/Aesthermortis/eslint-plugin-promise/commit/88cfa03ca487f21e53f8ae20c7cc4801d4e96d73))
* **package:** remove unused rollup-plugin-dts ([9d500d6](https://github.com/Aesthermortis/eslint-plugin-promise/commit/9d500d6c52493c7f500bb88ebace0de810a2f47e))
* **rule-tester:** use ESLint RuleTester ([54ccd9a](https://github.com/Aesthermortis/eslint-plugin-promise/commit/54ccd9a50f9a9f90a5ddbbab00b2abe1895dd795))
* **rules:** avoid no-nesting JSDoc alignment loop ([553b7d7](https://github.com/Aesthermortis/eslint-plugin-promise/commit/553b7d7d7162272aaec85d99d2b77d4fe6dffe1a))
* **rules:** move rule tests under rules directory ([90a137c](https://github.com/Aesthermortis/eslint-plugin-promise/commit/90a137c4151029a6d4791174ff458b1e6ede2067))
* **rules:** remove redundant no-nesting guard ([e2c029a](https://github.com/Aesthermortis/eslint-plugin-promise/commit/e2c029a6c9da73237b29b01476032875792e6a9f))


### 🤖 Automation

* **deps-dev:** bump the dev-dependencies group with 8 updates ([#3](https://github.com/Aesthermortis/eslint-plugin-promise/issues/3)) ([27d6e51](https://github.com/Aesthermortis/eslint-plugin-promise/commit/27d6e51ae754adb2f0a623711f2558164005a0ab))
* **deps:** bump fast-uri from 3.1.0 to 3.1.2 ([#4](https://github.com/Aesthermortis/eslint-plugin-promise/issues/4)) ([bf84196](https://github.com/Aesthermortis/eslint-plugin-promise/commit/bf841966918507d980c74a26d525b56455107853))
* **tooling:** configure type-aware linting ([1d58001](https://github.com/Aesthermortis/eslint-plugin-promise/commit/1d58001f8d51e841dec7154ceb8c5997d4046ef4))

## [8.0.0](https://github.com/Aesthermortis/eslint-plugin-promise/compare/v7.2.1...v8.0.0) (2026-05-01)


### ⚠ BREAKING CHANGES

* **config:** CommonJS usage, legacy eslintrc configuration, and older ESLint compatibility paths are no longer supported.

### 🧹 Chores

* **config:** migrate plugin to ESM and ESLint 10 ([36ad103](https://github.com/Aesthermortis/eslint-plugin-promise/commit/36ad103d054f1b74c2c01b32629e9a170d492777))

## [7.2.1](https://github.com/eslint-community/eslint-plugin-promise/compare/v7.2.0...v7.2.1) (2024-11-26)


### 🩹 Fixes

* **`no-callback-in-promise`:** false triggering of callback ([#574](https://github.com/eslint-community/eslint-plugin-promise/issues/574)) ([8324564](https://github.com/eslint-community/eslint-plugin-promise/commit/83245645a1731b8720ba4b17951f0e98567f449c))


### 🧹 Chores

* **deps-dev:** update husky to v9.1.7 ([#573](https://github.com/eslint-community/eslint-plugin-promise/issues/573)) ([24fd90a](https://github.com/eslint-community/eslint-plugin-promise/commit/24fd90a0262e1521983095f0934e9bb0195b4d23))
* **deps:** bump cross-spawn from 7.0.3 to 7.0.6 ([#568](https://github.com/eslint-community/eslint-plugin-promise/issues/568)) ([f33f82e](https://github.com/eslint-community/eslint-plugin-promise/commit/f33f82e03ee949d2864e266aedfe5da9762ad540))

## [7.2.0](https://github.com/eslint-community/eslint-plugin-promise/compare/v7.1.0...v7.2.0) (2024-11-25)


### 🌟 Features

* **`no-callback-in-promise`:** add `timeoutsErr` option ([#514](https://github.com/eslint-community/eslint-plugin-promise/issues/514)) ([907753f](https://github.com/eslint-community/eslint-plugin-promise/commit/907753f4b6108ba78b93571a40b6f1384b3c6899))
* **`valid-params`:** add `exclude` option ([#515](https://github.com/eslint-community/eslint-plugin-promise/issues/515)) ([7ff2cb9](https://github.com/eslint-community/eslint-plugin-promise/commit/7ff2cb9298f5dd0b4dae82321605d04e50ca935b))
* **always-return:** add `ignoreAssignmentVariable` option ([#518](https://github.com/eslint-community/eslint-plugin-promise/issues/518)) ([701279c](https://github.com/eslint-community/eslint-plugin-promise/commit/701279c573437598e86873f48b4f5cf6432ae38e))
* **catch-or-return:** add `allowThenStrict` option ([#522](https://github.com/eslint-community/eslint-plugin-promise/issues/522)) ([53be970](https://github.com/eslint-community/eslint-plugin-promise/commit/53be970e91023a104ce3ef2918b3ee80ef265f27))
* new rule `prefer-catch` ([#525](https://github.com/eslint-community/eslint-plugin-promise/issues/525)) ([05c8a93](https://github.com/eslint-community/eslint-plugin-promise/commit/05c8a930893e6abff2a0a7e1fb82a1543c19df9f))


### 🩹 Fixes

* permit appropriate computed member expressions and prototype access ([#535](https://github.com/eslint-community/eslint-plugin-promise/issues/535)) ([4de9d43](https://github.com/eslint-community/eslint-plugin-promise/commit/4de9d43b84f1beb166a7ba779a4da9d732d0eab3))


### 🧹 Chores

* **deps-dev:** bump eslint-plugin-jest from 28.6.0 to 28.8.0 ([#536](https://github.com/eslint-community/eslint-plugin-promise/issues/536)) ([80741f8](https://github.com/eslint-community/eslint-plugin-promise/commit/80741f849db526cad362cfc976c69a1df036a6c6))
* **deps-dev:** bump eslint-plugin-n from 17.9.0 to 17.10.2 ([#529](https://github.com/eslint-community/eslint-plugin-promise/issues/529)) ([a646010](https://github.com/eslint-community/eslint-plugin-promise/commit/a646010a7700a87c0fcc8aa0bb0d580bd6a14fd4))
* **deps-dev:** bump globals from 15.8.0 to 15.9.0 ([#527](https://github.com/eslint-community/eslint-plugin-promise/issues/527)) ([b8afe92](https://github.com/eslint-community/eslint-plugin-promise/commit/b8afe920bd3be1120f5effb4a9a71451a3e71c24))
* **deps-dev:** bump husky from 9.1.2 to 9.1.4 ([#524](https://github.com/eslint-community/eslint-plugin-promise/issues/524)) ([b8fdb9f](https://github.com/eslint-community/eslint-plugin-promise/commit/b8fdb9f1d23446d74a9d0976507988dac06684b2))
* **deps-dev:** bump lint-staged from 15.2.7 to 15.2.8 ([#539](https://github.com/eslint-community/eslint-plugin-promise/issues/539)) ([9e2528f](https://github.com/eslint-community/eslint-plugin-promise/commit/9e2528ffabe91217d0cd12d634dceb70462b9353))
* **deps-dev:** update eslint-plugin-eslint-plugin to v6.3.0 ([#560](https://github.com/eslint-community/eslint-plugin-promise/issues/560)) ([7459bd6](https://github.com/eslint-community/eslint-plugin-promise/commit/7459bd67b0056d363e3d53de084642eb79b74944))
* **deps-dev:** update eslint-plugin-eslint-plugin to v6.3.1 ([#561](https://github.com/eslint-community/eslint-plugin-promise/issues/561)) ([434c6fa](https://github.com/eslint-community/eslint-plugin-promise/commit/434c6fa2ed1d8747b28b002ce539fa5ccc2d0921))
* **deps-dev:** update eslint-plugin-eslint-plugin to v6.3.2 ([#570](https://github.com/eslint-community/eslint-plugin-promise/issues/570)) ([a849f64](https://github.com/eslint-community/eslint-plugin-promise/commit/a849f6467ef90ec2f3c988b9e6591b347287a80a))
* **deps-dev:** update eslint-plugin-jest to v28.9.0 ([#565](https://github.com/eslint-community/eslint-plugin-promise/issues/565)) ([cf213fb](https://github.com/eslint-community/eslint-plugin-promise/commit/cf213fbab43533f338333b1cb986d4b1041dc51c))
* **deps-dev:** update eslint-plugin-n to v17.12.0 ([#563](https://github.com/eslint-community/eslint-plugin-promise/issues/563)) ([d39e2f0](https://github.com/eslint-community/eslint-plugin-promise/commit/d39e2f0d6f5cbaa495957aa69be74f4c94113148))
* **deps-dev:** update eslint-plugin-n to v17.13.0 ([#566](https://github.com/eslint-community/eslint-plugin-promise/issues/566)) ([b62f234](https://github.com/eslint-community/eslint-plugin-promise/commit/b62f2345de7a1d307ff63e761471431cfc2bfb8f))
* **deps-dev:** update eslint-plugin-n to v17.13.1 ([#567](https://github.com/eslint-community/eslint-plugin-promise/issues/567)) ([266ddbb](https://github.com/eslint-community/eslint-plugin-promise/commit/266ddbb03076c05c362a6daecb9382b80cdd7108))
* **deps-dev:** update eslint-plugin-n to v17.13.2 ([#569](https://github.com/eslint-community/eslint-plugin-promise/issues/569)) ([390f51f](https://github.com/eslint-community/eslint-plugin-promise/commit/390f51fe07b2d375ec93f52c19a6964637c3ae8c))
* **deps-dev:** update npm-run-all2 to v6.2.4 ([#558](https://github.com/eslint-community/eslint-plugin-promise/issues/558)) ([2cf1732](https://github.com/eslint-community/eslint-plugin-promise/commit/2cf17322af17311fac773b524fa55589ebe4c9fd))
* **deps-dev:** update npm-run-all2 to v6.2.6 ([#559](https://github.com/eslint-community/eslint-plugin-promise/issues/559)) ([dc32933](https://github.com/eslint-community/eslint-plugin-promise/commit/dc32933c0d61e2a916a96ee21d37d3058976c090))
* **deps:** switch from dependabot to renovate using shared eslint community configuration ([#537](https://github.com/eslint-community/eslint-plugin-promise/issues/537)) ([30efed7](https://github.com/eslint-community/eslint-plugin-promise/commit/30efed7cf9e8b49d6368df9ae8be84b9619cf621))
* **deps:** update @eslint-community/eslint-utils to v4.4.1 ([#562](https://github.com/eslint-community/eslint-plugin-promise/issues/562)) ([5c3628d](https://github.com/eslint-community/eslint-plugin-promise/commit/5c3628de60c4a5f6cbcd9240264397c5f7821f16))
* **deps:** update globals to v15.12.0 ([#564](https://github.com/eslint-community/eslint-plugin-promise/issues/564)) ([c8632d1](https://github.com/eslint-community/eslint-plugin-promise/commit/c8632d1558f87c5c4761a9e7b5a7f277c8bdfda6))
* update @typescript-eslint/parser to v7.18.0 ([#545](https://github.com/eslint-community/eslint-plugin-promise/issues/545)) ([5744e60](https://github.com/eslint-community/eslint-plugin-promise/commit/5744e6061059acbd2fe736bd74cd50c5d3fd2808))
* update dependency eslint-plugin-n to v17.11.0 ([#556](https://github.com/eslint-community/eslint-plugin-promise/issues/556)) ([bbd048b](https://github.com/eslint-community/eslint-plugin-promise/commit/bbd048bdd13e3004f56863fae8221e4e8fcaac77))
* update dependency eslint-plugin-n to v17.11.1 ([#557](https://github.com/eslint-community/eslint-plugin-promise/issues/557)) ([e545254](https://github.com/eslint-community/eslint-plugin-promise/commit/e5452545904462a5c5574ed506d4d9d6afca6701))
* update dependency globals to v15.11.0 ([#555](https://github.com/eslint-community/eslint-plugin-promise/issues/555)) ([9151db8](https://github.com/eslint-community/eslint-plugin-promise/commit/9151db8c21c9566ad7c87aad55a75fedba6cb980))
* update dependency typescript to v5.6.3 ([#554](https://github.com/eslint-community/eslint-plugin-promise/issues/554)) ([ab55120](https://github.com/eslint-community/eslint-plugin-promise/commit/ab55120d425047594db18c4cfb3f5c1f6bd44b61))
* update eslint to v8.57.1 ([#551](https://github.com/eslint-community/eslint-plugin-promise/issues/551)) ([38e2757](https://github.com/eslint-community/eslint-plugin-promise/commit/38e27571e8583eb014b167fccc37f9b5a90af52f))
* update eslint-plugin-jest to v28.8.3 ([#548](https://github.com/eslint-community/eslint-plugin-promise/issues/548)) ([89f2578](https://github.com/eslint-community/eslint-plugin-promise/commit/89f257856b919fac252c2a6e742f2c385c7cf25e))
* update eslint-plugin-n to v17.10.3 ([#552](https://github.com/eslint-community/eslint-plugin-promise/issues/552)) ([2d738fe](https://github.com/eslint-community/eslint-plugin-promise/commit/2d738fedfc162215140c374a6de4a2d2d13c0472))
* update globals to v15.10.0 ([#553](https://github.com/eslint-community/eslint-plugin-promise/issues/553)) ([b871314](https://github.com/eslint-community/eslint-plugin-promise/commit/b8713140b2e42180a936b21d503273f2aacaea4a))
* update husky to v9.1.6 ([#547](https://github.com/eslint-community/eslint-plugin-promise/issues/547)) ([1e8d18f](https://github.com/eslint-community/eslint-plugin-promise/commit/1e8d18f56a889d4f1ba327c3554bec84c8e9fcb2))
* update lint-staged to v15.2.10 ([#544](https://github.com/eslint-community/eslint-plugin-promise/issues/544)) ([7d46b3b](https://github.com/eslint-community/eslint-plugin-promise/commit/7d46b3b0eced0ff31a4e8492b70cd4f363f02d2e))
* update npm-run-all2 to v6.2.3 ([#550](https://github.com/eslint-community/eslint-plugin-promise/issues/550)) ([14cd4c0](https://github.com/eslint-community/eslint-plugin-promise/commit/14cd4c098e50a6c5d14becafc9f337237015a5cc))
* update typescript to ~5.6.0 ([#549](https://github.com/eslint-community/eslint-plugin-promise/issues/549)) ([ebcdd8b](https://github.com/eslint-community/eslint-plugin-promise/commit/ebcdd8bc6e2fed8164abf78650a7d45689aa04dc))

## [7.1.0](https://github.com/eslint-community/eslint-plugin-promise/compare/v7.0.0...v7.1.0) (2024-08-06)


### 🌟 Features

* **`catch-or-return`, `prefer-await-to-then`:** do not report Cypress commands ([#495](https://github.com/eslint-community/eslint-plugin-promise/issues/495)) ([943f162](https://github.com/eslint-community/eslint-plugin-promise/commit/943f16290f11af9717612e079646802e22310290))
* **`prefer-await-to-then`:** ignore constructor scope unless with `strict` option ([#496](https://github.com/eslint-community/eslint-plugin-promise/issues/496)) ([7bffb7a](https://github.com/eslint-community/eslint-plugin-promise/commit/7bffb7a666ed74a876ba3a6c482c36ea6f9d6d07))
* new rule `spec-only` to check for non-spec Promise methods ([#502](https://github.com/eslint-community/eslint-plugin-promise/issues/502)) ([d6e9de1](https://github.com/eslint-community/eslint-plugin-promise/commit/d6e9de1f9c81194b775484ed0299dc5cc4898684))


### 📚 Documentation

* fixes the CI readme badge ([#511](https://github.com/eslint-community/eslint-plugin-promise/issues/511)) ([030a3be](https://github.com/eslint-community/eslint-plugin-promise/commit/030a3be890d371381ef13258806f97ec62d6b4fd))
* supply missing docs ([#503](https://github.com/eslint-community/eslint-plugin-promise/issues/503)) ([602d825](https://github.com/eslint-community/eslint-plugin-promise/commit/602d8254871e46c9d1808ee1a3a2c48cb7493334))


### 🧹 Chores

* bump dev dependencies ([#483](https://github.com/eslint-community/eslint-plugin-promise/issues/483)) ([197ae4e](https://github.com/eslint-community/eslint-plugin-promise/commit/197ae4eb4f05f34c54189102871d969379595a54))
* **deps-dev:** bump husky from 9.1.1 to 9.1.2 ([#516](https://github.com/eslint-community/eslint-plugin-promise/issues/516)) ([ab8e7a0](https://github.com/eslint-community/eslint-plugin-promise/commit/ab8e7a0d4fc8bde63fb6a6bb1e9743152778c4ee))
* file extension missing ([#519](https://github.com/eslint-community/eslint-plugin-promise/issues/519)) ([94c9834](https://github.com/eslint-community/eslint-plugin-promise/commit/94c983483596bca2baa6c710273d348f8cf98d58))
* fix format.yml ([#507](https://github.com/eslint-community/eslint-plugin-promise/issues/507)) ([948c097](https://github.com/eslint-community/eslint-plugin-promise/commit/948c09776e23e7dc38f155b268dcc002d59a957b))

## 6.0.2

- Added tests for @typescript-eslint/parser support

## 6.0.1

- Fixed @typescript-eslint/parser issue #331, #205

## 6.0.0

- Dropped node 10 from engines #231
- Updated a ton of deps #236, #237, #235, #234
- ESLint 8 support #219

## 5.2.0

- Updated `param-names` rule to allow for unused params

## 5.1.1

- Updated docs to include `no-callback-in-promise` reasons #215

## 5.1.0

- Included `catch()` and `finally()` in `prefer-await-to-then` #196
- Added some additional tests and upgraded some dev deps #196
- Exempted array methods in prefer-await-to-callbacks
  ([#212](https://github.com/eslint-community/eslint-plugin-promise/issues/212))

## 5.0.0

- ESLint 7.0 Support

## 4.3.1.

- Updated and applied prettier

## 4.3.0

- https://github.com/eslint-community/eslint-plugin-promise/pull/202
- Updated jest

## 4.2.2

- Added license
- Dependabot security updates

## 4.2.1

- Added more use cases to `no-return-wrap`

## 4.0.1

- Remove `promise/param-names` fixer
  ([#146](https://github.com/eslint-community/eslint-plugin-promise/pull/146))

## 4.0.0

- Added fixer for `promise/no-new-statics` rule
  ([#133](https://github.com/eslint-community/eslint-plugin-promise/pull/133))
- Support ESLint v5
  ([#144](https://github.com/eslint-community/eslint-plugin-promise/pull/144))

This is a breaking change that drops support for Node v4. In order to use ESLint
v5 and eslint-plugin-promise v4, you must use Node >=6.

## 3.8.0

- Removed `promise/avoid-new` from recommended configuration
  ([#119](https://github.com/eslint-community/eslint-plugin-promise/pull/119))
- Ignored event listener callbacks in `promise/prefer-await-to-callbacks`
  ([#117](https://github.com/eslint-community/eslint-plugin-promise/pull/117))
- Ignored top-level awaits in `promise/prefer-await-to-then`
  ([#126](https://github.com/eslint-community/eslint-plugin-promise/pull/126))
- Added docs for `promise/no-nesting` and `promise/prefer-await-to-then`
  ([#120](https://github.com/eslint-community/eslint-plugin-promise/pull/120))
  ([#121](https://github.com/eslint-community/eslint-plugin-promise/pull/121))

## 3.7.0

- Added `promise/valid-params` rule
  ([#85](https://github.com/eslint-community/eslint-plugin-promise/pull/85))
- Added `promise/no-new-statics` rule
  ([#82](https://github.com/eslint-community/eslint-plugin-promise/pull/82))
- Added fixer for `promise/param-names` rule
  ([#99](https://github.com/eslint-community/eslint-plugin-promise/pull/99))
- Added rule documentation to each rule
  ([#91](https://github.com/eslint-community/eslint-plugin-promise/pull/91))

## 3.6.0

- Added `['catch']` support in `catch-or-return`
- Added `no-return-in-finally` rule
- Fixed some formatting in the docs
- Added `allowReject` option to `no-return-wrap`
- Added exceptions for `no-callback-in-promise`

## 3.5.0

- Added support for recommended settings using
  `extends: plugin:promise/recommended`

## 3.4.2

- Fixed always return false positive with ternary (#31)

## 3.4.1

- fixed #49

## 3.4.0

- new rule: avoid-new
- new rule: no-promise-in-callback
- new rule: no-callback-in-promise
- new rule: no-nesting

## 3.3.2

- Removed eslint from peerDeps

## 3.3.1

- Updated engines with proper stuff
- Fixed bug for unreachable code

## 3.3.0

- Rule: `prefer-async-to-callbacks` added
- Rule: `prefer-async-to-then` added

## 3.2.1

- Fix: `no-return-wrap` rule missing from index.js

## 3.2.0

- Added `no-return-wrap` rule

## 3.1.0

- Added multiple terminationMethods

## 3.0.1

- Removed deprecated `always-catch` rule
- FIX: always-return error with "fn && fn()"

## 3.0.0

- Updated column and line numbers
- Added flow analysis for better handling of if statements

## 2.0.1

- Fixed type in docs

## 2.0.0

- ESLint 3.0 Support

## 1.3.2

- Updated tests to run on eslint 2.0
- Fixed some issues with `no-native` rule

## 1.3.1

- Actually added `no-native` rule

## 1.3.0

- Added `no-native` rule

## 1.2.0

- Allow `throw` in `always-return` rule
- Added `terminationMethod` option to `catch-or-return` rule

## 1.1.0

- Added `catch-or-return` rule

## 1.0.8

- Fixed crash issues

## 1.0.0 - 1.0.7

- Lots of basic feature updates and doc changes
