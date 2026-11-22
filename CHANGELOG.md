# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.1.1]

Unreleased canary line. The npm `latest` tag remains 2.1.0 until a stable 2.1.1 is approved.

### Added

- Privacy Guard CI check and a pre-publish package content check, so personal or private data is blocked before merge and before npm publish.
- Privacy Guard is re-synced with the skills template so the required check can use an optional SHA baseline. This repository has no baseline, so the check stays full-history.

### Changed

- `package.json` is now 2.1.1 so canaries publish as `2.1.1-canary.<sha>`, which sorts above the 2.1.0 stable. The publish workflow also bumps the canary base when `package.json` still matches `dist-tags.latest` or that version is already on npm.

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

[2.1.0]: https://github.com/vllnt/eslint-config/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/vllnt/eslint-config/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/vllnt/eslint-config/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/vllnt/eslint-config/releases/tag/v1.0.0
