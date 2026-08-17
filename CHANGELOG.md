# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-08-12

### Changed (BREAKING)

- `eslint-plugin-unicorn` ^62.0.0 → `65.x`: every active rule is now explicitly curated. New rules are enforced as `error`; `unicorn/isolated-functions` remains explicitly `off` because its outer-scope restriction is too aggressive for a general-purpose config. Deprecated rules were removed or migrated to `no-instanceof-builtins`, `prefer-single-call`, `dom-node-dataset`, and `consistent-json-file-read`. The range is capped below v66, which requires Node 22 and ESLint 10.4.
- `eslint-plugin-boundaries` ^5.4.0 → `7.2.x`: `boundaries/no-private` remains explicitly enforced as `['error', { allowUncles: true }]` because the recommended config disables it. Expanded dependency-node detection is adopted, so new findings are possible.
- `@convex-dev/eslint-plugin` ^1.2.1 → ^3.0.0: consuming projects using the Convex preset need Convex 1.43 or newer. All 7 official rules are enforced, including `no-filter-in-query`, `no-collect-in-query`, and `no-top-of-hour-crons`.
- The bundled `convex-rules/no-filter-on-query` rule was removed because the official Convex plugin now owns the capability; the custom-rule count is now 6.
- `eslint-plugin-functional` ^9.0.2 → ^10.0.0 and `eslint-plugin-simple-import-sort` ^12.1.1 → ^14.0.0. Import autofixes may reorder same-source multi-style imports once.
- Runtime compatibility is now Node.js >= 20.10, ESLint >= 9.38 and < 10, and optional TypeScript >= 5 and < 6.1.

### Changed

- Other upgrades: `typescript-eslint` 8.67.x, `@next/eslint-plugin-next` ^16.3.0, `eslint-plugin-perfectionist` ^5.10.1, `eslint-plugin-prettier` ^5.5.6, `eslint-plugin-react-hooks` ^7.1.1, `eslint-plugin-turbo` 2.10.9, `@eslint/js` ^9.39.5, and development ESLint ^9.39.5.
- Convex ^1.43.0 and Turbo 2.10.9 are explicit development dependencies so the plugin peer versions exercised by tests are deterministic. React 19.2.8 provides deterministic version detection for the React preset integration test.
- Security: pnpm now overrides vulnerable `deepmerge-ts <8.0.0` to 8.0.1 and narrowly excludes `deepmerge-ts` from the release-age guard to unblock GHSA-ggr8-5vv4-36mx while `eslint-plugin-functional` still depends on `^7.1.5`.
- Deferred by the 7-day supply-chain maturity window: `eslint-plugin-turbo` 2.10.10. ESLint 10, Unicorn 66+, and TypeScript 7 remain deferred for peer and runtime compatibility.

### Added

- `tests/rules.test.js`: rule-existence guard (every configured plugin rule must exist in its registered plugin), unicorn curation exhaustiveness guard (every active rule explicitly decided, no deprecated pins), boundaries `no-private` pin guard, convex all-official-rules-as-error guard
- `tests/preset-lint.test.js`: real ESLint run per preset against TypeScript fixtures — catches rule-option schema breakage that version bumps can introduce

### Fixed

- Refresh the lockfile and move dependency controls to `pnpm-workspace.yaml`: a 7-day minimum release age plus patched `brace-expansion` overrides. `pnpm audit --prod` reports zero vulnerabilities.

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
