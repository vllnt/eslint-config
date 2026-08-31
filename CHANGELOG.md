# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

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
