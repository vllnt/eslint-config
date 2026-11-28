# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.2.0] - 2026-11-27

### Added

- ESLint 10 support (#42). The `eslint >=9` peer range is unchanged and is now tested on 9 and 10: `pnpm test` runs the smoke, lint-behavior and Convex rule tests again on ESLint 10 through an `eslint10` development alias. `@eslint/compat` is a new dependency; it and its `@eslint/core` dependency declare Node `^20.19.0 || ^22.13.0 || >=24`, so Node 20.0 to 20.18 and 22.0 to 22.12 get an engine warning (or an install failure with `engine-strict`), while this package's `engines.node` stays `>=20`. ESLint 11 and later are inside the `>=9` range but untested. On ESLint 10, `eslint-plugin-react` 7.37.5 and `eslint-plugin-jsx-a11y` 6.10.2 print a peer warning, because their own ranges stop at 9.
- Privacy Guard CI check and a pre-publish package content check, so personal or private data is blocked before merge and before npm publish.
- Privacy Guard is re-synced with the skills template so the required check can use an optional SHA baseline. This repository has no baseline, so the check stays full-history.
- The npm package now ships `CHANGELOG.md` and `llms.txt` next to `README.md`, so coding agents can read docs that match the installed version from `node_modules/@vllnt/eslint-config/`. README and `llms.txt` each have a "For coding agents" note, and `llms.txt` links to the shipped files with relative paths and to the vllnt oss index.
- A package-contents test runs `npm pack --dry-run` and fails when `README.md`, `LICENSE`, `CHANGELOG.md`, `llms.txt` or an `exports` target is missing from the tarball, when tests, scripts or contributor files (`AGENTS.md`, `CONTRIBUTING.md`) are packed, or when a relative link in `llms.txt` points outside the tarball.
- `package.json` sets `homepage` to https://oss.vllnt.com/packages/eslint-config, `author`, `funding` and `bugs`, a one-sentence `description` that names the stack, and 12 keywords.
- Agent-first docs: the README follows the section order shared by @vllnt packages (When to use, Install, Quick start, an API table of every export with a reference per preset, Common tasks, an Errors and fixes table of every message this package defines (the `no-restricted-syntax` messages and the `convex-rules` messages as ESLint prints them) and of common setup errors, Limits and gotchas, Compatibility, a Links section to the package page, release feed, source, community and sponsor pages), and ends with the shared vllnt footer. The README line under the title, the `llms.txt` summary and the `package.json` description are the same sentence. `llms.txt` carries the same facts, links to the API and errors tables and ends with an Ecosystem block (package page, release feed, the oss and vllnt indexes, package search and author). Every public export has a TSDoc summary in its `.js` and `.d.ts`, and the entry point links the package page with `@see`. `tests/docs.test.js` checks all of this, and lints a sample project with each README and `llms.txt` example as its `eslint.config.js`, failing on any error, parse errors included. The examples now ignore `eslint.config.js`, because the presets turn on `projectService` for every linted file and a config file outside any `tsconfig.json` fails to parse.

### Fixed

- On ESLint 10, every preset built on the base rules (the root entry, Base, React, Next.js and Node.js) crashed: `write-good-comments` with `context.getSourceCode is not a function`, and `eslint-plugin-react` with `contextOrFilename.getFilename is not a function`. The presets now run the rules of `eslint-plugin-write-good-comments`, `eslint-plugin-react` and `eslint-plugin-css-modules` through `fixupRule` from `@eslint/compat`, which adds back the context methods ESLint 10 removed. The rules are replaced in place, so the plugin object stays the one a project imports: a config that registers its own `eslint-plugin-react` next to a preset keeps working, instead of failing with `Cannot redefine plugin "react"`. Rule results on ESLint 9 are unchanged.
- The repository install policy (`minimumReleaseAge` 10080 minutes, with `@vllnt/*` excluded) moved from the `pnpm` field of `package.json`, which pnpm 10 ignores for these settings, to a new `pnpm-workspace.yaml`. `pnpm add`, `pnpm update` and any lockfile change in this repository now refuse versions published less than 7 days ago; frozen installs do not re-resolve, so they do not check it. `pnpm test:package` reads the value from there. The shipped files and their behaviour are unchanged; the published `package.json` no longer carries these two keys.

### Changed

- Dependencies bumped within their majors (#22). Shipped plugins: `@convex-dev/eslint-plugin` 5.0.1, `@next/eslint-plugin-next` 16.4.6, `eslint-plugin-perfectionist` 5.14.0 and `eslint-plugin-turbo` 2.11.13 (2.11.13 changes only its version string). Development: `convex` 1.51.0, pnpm 10.34.9 and a lockfile refresh within the existing ranges. The repository's `handlebars` override now requires 4.7.10.
  - `pnpm audit` is clean in this repository only because of its pnpm overrides, which do not reach consumers. A consumer install still gets `handlebars` 4.7.8 through `eslint-plugin-boundaries` 5 (critical advisories; fixed from Boundaries 7.2.1, #31), `deepmerge-ts` 7 through `eslint-plugin-functional` 10.0.1 (GHSA-ggr8-5vv4-36mx; no `eslint-plugin-functional` release uses `deepmerge-ts` 8 yet) and `minimatch` 10 through `@convex-dev/eslint-plugin` (GHSA-g3hv-75wg-m249; 6.0.0 keeps the same pins). They run only inside ESLint; whether lint input can reach the vulnerable code is not verified.
  - Held majors: `@eslint/js` 10 (it drops ESLint 9, so the presets keep `@eslint/js` 9 on both ESLint majors), `eslint-plugin-unicorn` 66 to 80 (need ESLint >= 10.4), `eslint-plugin-boundaries` 6 and 7 (change what the preset reports, #31). `@convex-dev/eslint-plugin` 6.0.0 and `typescript-eslint` 8.74.0 are newer than the 7-day minimum release age.
- README: a "Related packages" section and a vllnt oss footer. It now describes what the presets actually configure: presets take no options and only subpaths have a default export; the install command pins the ESLint major (`eslint@^10` since this release; `eslint@^9` also works); `typescript` is required by every preset that type-checks; in React and Next.js, `.tsx` and `*.decorator.ts` files (and `*.decorator.ts` in Node.js) check only function names, and Next.js `app/api/**/route.*` drops the naming rule and the enum and `| undefined` bans; css-modules has no rule on; Boundaries needs `boundaries/elements`; `snake-case-filenames` only checks `convex/`; and the Perfectionist, React Hooks and Convex filename rules are listed as configured. Contributor docs that do not ship link to GitHub. Lint rules are unchanged.
- Canaries always sort above the current stable: the publish workflow bumps the canary base when `package.json` still matches `dist-tags.latest` or that version is already on npm.
- Every publish first runs `pnpm test:package`: it installs the packed tarball with pnpm into a clean project and, on ESLint 9 and on ESLint 10, loads each `exports` entry composed as the README shows, lints a clean sample (no errors) and a failing one, and type-checks a strict TypeScript consumer that imports every entry point.
- The package content check now also blocks `.spec.mts` and `.spec.cts` files from the tarball, and `pnpm test` runs its test harness.
- `pnpm test` type-checks the test files and scripts with strict TypeScript (`pnpm typecheck`), and a smoke test fails when one of them lacks the `// @ts-check` line that opts it in.
- README: the Links section adds the npm package page, and the `eslint-plugin-turbo` link points at turborepo.dev.

### Known gaps

- Still open for 3.0.0 (#31), because each fix would fail code that lints clean today. In React and Next.js, `.tsx` and `*.decorator.ts` files check only function names, and so do `*.decorator.ts` files in Node.js. Next.js `app/api/**/route.*` drops the enum and `| undefined` bans. css-modules is registered with no rule on. `snake-case-filenames` skips `src/component/`.

## [2.1.0] - 2026-11-17

### Added

- TypeScript declarations for every preset entry point, so TypeScript consumers no longer get TS7016 on `import { nextjs } from "@vllnt/eslint-config"` or the subpath imports under `strict`. A type-check test covers every export.
- `@vllnt/eslint-config/playwright`, an opt-in overlay for `**/tests/e2e/**/*.{spec,setup}.ts`, `**/e2e/**/*.spec.ts` and `**/playwright.config.{ts,mts}`. It turns off `functional/no-loop-statements` and `max-lines-per-function` there and stops checking object literal key names in `@typescript-eslint/naming-convention`; every other rule, including `write-good-comments` and `unicorn/prevent-abbreviations`, stays on. Spread it after a language preset (`[...nextjs, ...playwright]`).
- `@vllnt/eslint-config/ignores`, a shared list of tool output to ignore (`coverage/`, `playwright-report/`, `test-results/`, `.turbo/`, `.worktrees/` at any depth; `dist/` and `build/` at the config root), so repos stop copying and drifting from the same list (part of #16; the React Native entry and the formatter choice remain open).
- Lint-behavior tests that run real ESLint over fixture files with the Node API, covering the Next.js route handler conventions, the Playwright overlay and the ignores, each with a clean fixture and a near-miss that must still fail (part of #4; the base, nodejs, react and convex presets still need their own lint runs).

### Fixed

- Convex `standard-filenames` and `namespace-separation` now accept `node_actions.ts` for actions that run in the Node.js runtime.
- Convex custom rules (`standard-filenames`, `namespace-separation`, `snake-case-filenames`, `no-bare-v-any`) now normalise Windows path separators, so `queries.ts`-style files are no longer reported as misplaced on Windows.

### Changed

- Next.js preset: route files (`app/**/route.{js,jsx,ts}`) accept `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` and `OPTIONS` as exported function names through a narrow `@typescript-eslint/naming-convention` selector, so apps no longer turn the rule off for them. Any other name still follows the base convention, and `functional/no-loop-statements` stays on in route handlers. `route.tsx` keeps the `.tsx` naming rule, which already accepts PascalCase functions such as `GET` and JSX helpers.
  - Under `app/api/**/route.*`, `@typescript-eslint/naming-convention` stays off, as before. The exported-function allowlist there now also accepts `HEAD`, `PATCH`, `OPTIONS` and `generateStaticParams`, which it used to reject. Turning the naming rule on there is tracked for 3.0.0 in #31.
- Every preset: object and type property names that need quotes (`'content-type'`, `'@type'`, `'x-default'`) are exempt from `@typescript-eslint/naming-convention`, because an external format fixes their spelling. Names that do not need quotes (`user_id`) are still checked.
- Next.js preset: ignore `.next/`, `out/`, `build/` and `next-env.d.ts` by default, as Next.js does.

- typescript-eslint 8.73.0 adds `@typescript-eslint/no-unsafe-class-instance-assignment`
  to `strictTypeChecked`; it stays off so the upgrade adds no errors. Turning it on is
  tracked for 3.0.0 in #31.
- Upgrade dependencies: `typescript-eslint` 8.73.0, `@next/eslint-plugin-next` 16.4.3,
  `eslint-plugin-functional` 10.0.1, `eslint-plugin-perfectionist` 5.13.0,
  `eslint-plugin-prettier` 5.5.7, `eslint-plugin-turbo` 2.11.10,
  `eslint-plugin-simple-import-sort` 14.0.0, `eslint-plugin-unicorn` 65.0.1 and `@convex-dev/eslint-plugin` 5.0.0;
  refresh the lockfile. The `typescript-eslint` upgrade enables two more strict
  rules at error level: `@typescript-eslint/no-generated-empty-object-type` and
  `@typescript-eslint/no-unsafe-enum-assignment`. Peer dependency ranges are
  unchanged; `eslint` and `@eslint/js` stay on 9.
  The `eslint-plugin-unicorn` upgrade (62 to 65) can report errors on code that passed
  2.0.0; `eslint --fix` fixes both cases seen in vllnt consumers:
  `unicorn/numeric-separators-style` now checks the digits after the decimal point
  (`0.040_45` becomes `0.04045`), and `unicorn/prefer-set-has` flags more constant
  arrays that are only used for membership checks (`['ui', 'dig'].includes(slug)`
  becomes a `Set` with `.has()`).

- Run the org leak gate on pull requests and pushes to main to block secrets and private references.

- Test on the patched Node 22.23.4 and 24.22.1 in CI instead of end-of-life Node 20, and publish with Node 24.22.1 from `.node-version` (October 2026 security release). `engines.node` is unchanged.
- Correct README preset guidance and security release-line documentation; remove
  `llms-full.txt` and retain `llms.txt` as the maintained LLM documentation index.
- Publish `@latest` only from a pushed `vX.Y.Z` tag on `main` (version and changelog entry must match) instead of on every version change; pin workflow actions to commit SHAs, use least-privilege permissions, and enforce pnpm 10 install policies (minimum release age, blocked install scripts).
- Test every custom Convex rule and assert that every configured rule id resolves to a registered rule in each preset, so a plugin upgrade that removes a rule fails CI instead of crashing consumers.
- Consolidate repository contributor guidance in `AGENTS.md` and enforce that it remains the sole agent instruction surface.
- Document ESLint Config Inspector, aggregate rule timing, granular per-file stats, and repeatable profiling practices.
- Require agents to verify inherited rules against the lockfile-pinned plugin version and the composed preset source in `AGENTS.md`.

### Removed

- The `eslint-config-prettier` dependency. No preset imported it, so it never disabled a
  rule; lint behavior is unchanged.

### Security

- Pin `typescript-eslint` to 8.73.0, whose `@typescript-eslint/typescript-estree` depends on
  `minimatch` ^11.0.1, so that path no longer installs `minimatch` 10.2.6
  (GHSA-g3hv-75wg-m249, a denial of service through glob pattern amplification, fixed in
  11.0.1). Consumers still get the affected version through `@convex-dev/eslint-plugin`, a
  dependency of this package whatever preset is used: every 5.x release pins
  `@typescript-eslint/*` ~8.58, which needs `minimatch` ^10. Until that plugin updates,
  force the fixed version in the consuming project: `"minimatch@>=7.0.0 <11.0.1": "^11.0.1"`
  under `pnpm.overrides` (as this repository does), `overrides` for npm or `resolutions`
  for Yarn. The glob patterns come from the project's own ESLint and TypeScript
  configuration, so the practical risk is a slow lint run.

## [2.0.0] - 2026-08-31

### Changed

- Require the TypeScript 6 compatibility API (`>=6.0.2 <6.1`) for type-aware
  linting and validate the official side-by-side TypeScript 7 compiler setup.
- Upgrade and pin `typescript-eslint` to `8.68.0` so package managers cannot
  select an unpublished companion package, upgrade `eslint-plugin-functional`
  to its TypeScript 6-compatible major, and refresh compatible lint plugins.
- Upgrade `@convex-dev/eslint-plugin` to `^4.0.0`, retain the four established
  official rules, and apply the Convex preset directly to sandboxed
  `src/component/**` sources.
- Correct the documented Node.js runtime floor to 20.

### Breaking Changes

- TypeScript 5 is no longer supported. Install TypeScript 7 through
  `@typescript/native` and TypeScript 6 under the canonical `typescript` package
  name when using JavaScript-API tooling.
- Sandboxed `src/component/**` sources now receive the official Convex rules
  directly from the preset.

## [1.0.1] - 2026-03-29

### Changed

- CI: auto-release on push to main when new version detected (replaces manual workflow_dispatch)
- CI: enforce CHANGELOG.md updated in every PR with version match check

### Fixed

- Resolve 23 transitive dependency vulnerabilities (1 critical, 14 high, 7 moderate, 1 low) (#12)
- Bump `@convex-dev/eslint-plugin` ^1.1.1 to ^1.2.1
- Bump `eslint` (dev) ^9.39.2 to ^9.39.4
- Add `pnpm.overrides` for `handlebars` (pinned by upstream `@boundaries/elements`)
- Refresh lockfile to resolve minimatch, picomatch, flatted, brace-expansion to patched versions

## [1.0.0] - 2026-03-05

### Added

- Initial release
- 7 presets: Base, React, Next.js, Node.js, Convex, Turbo, Boundaries
- TypeScript-first with `strictTypeChecked` + `stylisticTypeChecked`
- Prettier built-in as lint errors
- 7 custom Convex lint rules bundled as `eslint-plugin-convex-rules`
- Smoke tests with 43 assertions
- CI/CD with GitHub Actions (test + canary publish + release)

[2.2.0]: https://github.com/vllnt/eslint-config/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/vllnt/eslint-config/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/vllnt/eslint-config/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/vllnt/eslint-config/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/vllnt/eslint-config/releases/tag/v1.0.0
