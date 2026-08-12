---
title: Dependency upgrade — plugin majors on ESLint 9 (v2.0.0)
status: active
created: 2026-06-10
updated: 2026-08-12
estimate: 2.5h
tier: mini
---

# Dependency upgrade — plugin majors on ESLint 9 (v2.0.0)

## Context

The package is still on its March dependency set. On 2026-08-12, `pnpm outdated`
reported five compatible updates and six plugin-major candidates; the checked-in
lockfile also reported 18 production advisories, including 12 high severity.

ESLint 10 is not part of this release. `eslint-plugin-react` and
`eslint-plugin-jsx-a11y` do not declare ESLint 10 support, while Unicorn 66+
requires Node 22 and ESLint 10.4. TypeScript 7 is also outside the supported
`typescript-eslint` range. Version 2 therefore takes the newest mature dependency
set that remains compatible with ESLint 9 and Node 20.

## Compatibility matrix

Verified against npm registry metadata on 2026-08-12.

| Dependency | From | Target | Compatibility decision |
|------------|------|--------|------------------------|
| `@convex-dev/eslint-plugin` | ^1.2.1 | ^3.0.0 | Requires Convex ^1.43.0; adds a seventh official rule |
| `eslint-plugin-unicorn` | ^62.0.0 | 65.x | Requires Node ^20.10 or newer and ESLint >=9.38; cap below v66 |
| `eslint-plugin-boundaries` | ^5.4.0 | 7.1.x | v7.2 is inside the 7-day maturity window |
| `eslint-plugin-functional` | ^9.0.2 | ^10.0.0 | Supports ESLint 9 and Node 20 |
| `eslint-plugin-simple-import-sort` | ^12.1.1 | ^14.0.0 | Supports ESLint 9 |
| `eslint-plugin-turbo` | ^2.8.10 | 2.10.8 | v2.10.9 is inside the maturity window |
| `typescript-eslint` | ^8.56.0 | 8.66.x | v8.67 is inside the maturity window; TypeScript must remain <6.1 |
| `@next/eslint-plugin-next` | ^16.1.6 | ^16.3.0 | Compatible update |
| `eslint-plugin-perfectionist` | ^5.6.0 | ^5.10.1 | Compatible update |
| `eslint-plugin-prettier` | ^5.5.5 | ^5.5.6 | Compatible update |
| `eslint-plugin-react-hooks` | ^7.0.1 | ^7.1.1 | Compatible update |
| `@eslint/js` / `eslint` | 9.39.2 / 9.39.4 | ^9.39.5 | Stay on ESLint 9 |

## Acceptance criteria

- [x] Every preset imports as a non-empty flat-config array.
- [x] Every configured plugin rule exists in the registered plugin.
- [x] Every preset completes a real ESLint run without fatal config, parser, or
  rule-option errors.
- [x] Every active Unicorn 65 rule is an explicit `error` or `off` decision, and
  no deprecated Unicorn rule remains configured.
- [x] `boundaries/no-private` remains explicitly enforced with `allowUncles`.
- [x] All 7 official Convex rules are errors, and the bundled plugin no longer
  duplicates the official query-filter rule.
- [x] Package and documentation compatibility ranges match.
- [x] `pnpm audit --prod` reports zero vulnerabilities.

## Implementation

- Upgrade the dependency ranges, explicitly install Convex and Turbo as test
  environment peer dependencies, and install React for deterministic preset
  version detection.
- Migrate Unicorn 65 renamed/deprecated rules and decide every newly active rule.
- Remove the bundled `no-filter-on-query`; use the official Convex rule instead.
- Keep the boundaries strictness override that upstream recommended configs omit.
- Add permanent rule-existence, curation-exhaustiveness, and real-preset tests.
- Move pnpm dependency controls out of the ignored `package.json#pnpm` field and
  into `pnpm-workspace.yaml`, including the 7-day minimum release age and
  transitive security overrides.
- Update README, llms documents, agent/contributor guidance, security policy, and
  changelog in the same release commit.

## Non-goals

- ESLint 10 or `@eslint/js` 10.
- Unicorn 66+ and a Node 22 minimum.
- TypeScript 7.
- Reworking the standalone Convex preset parser composition.
- Changing unrelated lint-policy decisions.

## Test strategy

- `node --test tests/*.test.js`: 62 assertions across smoke, rule-contract, and
  real ESLint preset execution.
- `pnpm install --frozen-lockfile`: reproducible dependency graph.
- `pnpm audit --prod`: production dependency vulnerability gate.
- `pnpm pack --dry-run`: published tarball boundary.

## Deferred updates

The following stable releases were less than seven days old on 2026-08-12 and
remain intentionally deferred: `eslint-plugin-boundaries` 7.2.0,
`eslint-plugin-turbo` 2.10.9, and `typescript-eslint` 8.67.0.
