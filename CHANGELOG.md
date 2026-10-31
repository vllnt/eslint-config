# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [2.1.0] - Unreleased

### Fixed

- Convex custom rules (`standard-filenames`, `namespace-separation`, `snake-case-filenames`, `no-bare-v-any`) now normalise Windows path separators, so `queries.ts`-style files are no longer reported as misplaced on Windows.

### Changed

- Upgrade dependencies: `typescript-eslint` 8.72.0, `@next/eslint-plugin-next` 16.4.3,
  `eslint-plugin-functional` 10.0.1, `eslint-plugin-perfectionist` 5.13.0,
  `eslint-plugin-prettier` 5.5.7, `eslint-plugin-turbo` 2.11.10,
  `eslint-plugin-simple-import-sort` 14.0.0, `eslint-plugin-unicorn` 65.0.1 and `@convex-dev/eslint-plugin` 5.0.0;
  refresh the lockfile. The `typescript-eslint` upgrade enables two more strict
  rules at error level: `@typescript-eslint/no-generated-empty-object-type` and
  `@typescript-eslint/no-unsafe-enum-assignment`. Peer dependency ranges are
  unchanged; `eslint` and `@eslint/js` stay on 9.

- Run the org leak gate on pull requests and pushes to main to block secrets and private references.

- Test on the patched Node 22.23.4 and 24.22.1 in CI instead of end-of-life Node 20, and publish with Node 24.22.1 from `.node-version` (October 2026 security release). `engines.node` is unchanged.
- Correct README preset guidance and security release-line documentation; remove
  `llms-full.txt` and retain `llms.txt` as the maintained LLM documentation index.
- Publish `@latest` only from a pushed `vX.Y.Z` tag on `main` (version and changelog entry must match) instead of on every version change; pin workflow actions to commit SHAs, use least-privilege permissions, and enforce pnpm 10 install policies (minimum release age, blocked install scripts).
- Test every custom Convex rule and assert that every configured rule id resolves to a registered rule in each preset, so a plugin upgrade that removes a rule fails CI instead of crashing consumers.
- Consolidate repository contributor guidance in `AGENTS.md` and enforce that it remains the sole agent instruction surface.

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
