# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-06-10

### Changed (BREAKING)

- `eslint-plugin-unicorn` ^62.0.0 → `64.x`: 38 newly curated rules enforced as `error` (34 pre-existing curation gaps + 4 added in v63/v64); `unicorn/isolated-functions` explicitly `off` (outer-scope-variable restriction too aggressive for general code). Range capped below v65 because v65 removes `better-regex` and renames `prefer-dom-node-dataset` — a caret range would break consumers resolving v65 against this config; migration queued.
- Deprecated unicorn pins migrated to successors: `no-instanceof-array` → `no-instanceof-builtins`, `no-array-push-push` → `prefer-single-call`
- `eslint-plugin-boundaries` ^5.4.0 → ^6.0.2: `boundaries/no-private` re-pinned as `['error', { allowUncles: true }]` (v6 recommended disables it; v5 strictness preserved); v6's expanded `dependency-nodes` default (`import`, `export`, `require`, `dynamic-import`) adopted — new findings possible
- `@convex-dev/eslint-plugin` ^1.2.1 → ^2.0.0: consuming projects need `convex >= 1.34.1`; `no-filter-in-query` + `no-collect-in-query` pinned as `error` (all 6 official rules enforced)
- `eslint-plugin-simple-import-sort` ^12.1.1 → ^13.0.0: deterministic ordering for same-source multi-style imports (autofix may reorder existing imports once)

### Changed

- Minor/patch bumps: `typescript-eslint` ^8.60.0, `@next/eslint-plugin-next` ^16.2.7, `eslint-plugin-perfectionist` ^5.9.0, `eslint-plugin-prettier` ^5.5.6, `eslint-plugin-react-hooks` ^7.1.1, `eslint-plugin-turbo` ^2.9.16, `@eslint/js` ^9.39.4
- Deferred — published under the 7-day supply-chain maturity window: `eslint-plugin-unicorn` 65, `eslint-plugin-functional` 10, `typescript-eslint` 8.61, `eslint-plugin-turbo` 2.9.17, `@next/eslint-plugin-next` 16.2.9. ESLint 10 deferred separately: `eslint-plugin-react` (peer ≤ ^9.7) and `eslint-plugin-jsx-a11y` (peer ≤ ^9) do not support it yet.

### Added

- `tests/rules.test.js`: rule-existence guard (every configured plugin rule must exist in its registered plugin), unicorn curation exhaustiveness guard (every active rule explicitly decided, no deprecated pins), boundaries `no-private` pin guard, convex all-official-rules-as-error guard
- `tests/preset-lint.test.js`: real ESLint run per preset against TypeScript fixtures — catches rule-option schema breakage that version bumps can introduce

### Fixed

- Resolve 5 lockfile vulnerabilities (1 high: lodash `_.template` code injection; 3 moderate; 1 low) via transitive refresh and `turbo >= 2.9.14` override

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

## [1.0.0] - 2026-03-14

### Added

- Initial release
- 7 presets: Base, React, Next.js, Node.js, Convex, Turbo, Boundaries
- TypeScript-first with `strictTypeChecked` + `stylisticTypeChecked`
- Prettier built-in as lint errors
- 7 custom Convex lint rules bundled as `eslint-plugin-convex-rules`
- Smoke tests with 43 assertions
- CI/CD with GitHub Actions (test + canary publish + release)

[2.0.0]: https://github.com/vllnt/eslint-config/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/vllnt/eslint-config/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/vllnt/eslint-config/releases/tag/v1.0.0
