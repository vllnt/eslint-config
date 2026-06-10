---
title: Dependency upgrade — plugin majors on ESLint 9 (v2.0.0)
status: active
created: 2026-06-10
estimate: 2.5h
tier: mini
---

# Dependency upgrade — plugin majors on ESLint 9 (v2.0.0)

## Context

15 deps outdated; 7 involve major bumps. ESLint 10 itself is blocked (eslint-plugin-react peer max `^9.7`, eslint-plugin-jsx-a11y peer max `^9`), but every plugin major works on ESLint 9. Upgrade everything except the ESLint 10 jump now; defer ESLint 10 until react/jsx-a11y support it.

## Compat Matrix (verified 2026-06-10 via npm registry)

| Dep | Current | Target | ESLint 9 OK | Breaking (for us) |
|-----|---------|--------|-------------|-------------------|
| eslint-plugin-unicorn | ^62.0.0 | ^65.0.1 | yes (peer >=9.38) | `better-regex` removed; `prefer-dom-node-dataset` → `dom-node-dataset` |
| eslint-plugin-functional | ^9.0.2 | ^10.0.0 | yes (^9 \|\| ^10) | none (node 18 drop only) |
| eslint-plugin-boundaries | ^5.4.0 | ^6.0.2 | yes (>=6) | recommended disables `no-private`; `dependency-nodes` default expanded; `element-types` → `dependencies` (alias kept) |
| eslint-plugin-simple-import-sort | ^12.1.1 | ^13.0.0 | yes (>=5) | autofix sort-order determinism only |
| @convex-dev/eslint-plugin | ^1.2.1 | ^2.0.0 | yes (no eslint peer) | none documented; peer `convex ^1.34.1`; adds `no-filter-in-query` |
| typescript-eslint | ^8.56.0 | ^8.61.0 | yes | minor |
| @next/eslint-plugin-next | ^16.1.6 | ^16.2.9 | yes | minor |
| eslint-plugin-perfectionist | ^5.6.0 | ^5.9.0 | yes | minor |
| eslint-plugin-prettier | ^5.5.5 | ^5.5.6 | yes | patch |
| eslint-plugin-react-hooks | ^7.0.1 | ^7.1.1 | yes | minor |
| eslint-plugin-turbo | ^2.8.10 | ^2.9.17 | yes | minor |
| eslint (dev) | ^9.39.4 | keep 9.x | — | ESLint 10 deferred (see below) |
| @eslint/js | ^9.39.2 | latest 9.x | — | @eslint/js 10 requires eslint ^10 |
| typescript (dev) | ^5.9.3 | optional ^6.0.3 | — | tseslint 8.61 supports `<6.1.0`; peer stays `>=5` |

Deferred — ESLint 10.4: blocked by eslint-plugin-react 7.37.5 (peer `^3||...||^9.7`) and eslint-plugin-jsx-a11y 6.10.2 (peer `...||^9`). Node engines would also need `^20.19.0 || ^22.13.0 || >=24`. Revisit when both plugins publish ESLint 10 peers.

## Codebase Impact

| Area | Impact | Detail |
|------|--------|--------|
| package.json | MODIFY | bump 11 dep ranges + version 2.0.0 |
| pnpm-lock.yaml | MODIFY | lockfile refresh |
| flat/core/unicorn.js | MODIFY | delete `unicorn/better-regex` (l.8); rename `prefer-dom-node-dataset` → `dom-node-dataset` (l.75); add all 37 new v63-65 rules as `error` EXCEPT conflict-screen exclusions, listed as explicit `off` (DECIDED 2026-06-10) |
| flat/core/boundaries.js | MODIFY | re-enable `'boundaries/no-private': ['error', { allowUncles: true }]`; accept expanded `dependency-nodes` v6 default (DECIDED 2026-06-10) |
| flat/convex.js | MODIFY | add `@convex-dev/no-filter-in-query` + `@convex-dev/no-collect-in-query` as `error`; update "all rules" comment 4 → 6 (DECIDED 2026-06-10) |
| tests/smoke.test.js | MODIFY | add rule-existence assertion: every configured `plugin/rule` exists in registered plugin |
| tests/preset-lint.test.js | CREATE | permanent integration test: run ESLint programmatically per preset against fixture, assert zero config/option-schema errors (DECIDED 2026-06-10) |
| CHANGELOG.md | MODIFY | 2.0.0 entry (CI enforces version match) |

**Reuse:** existing smoke-test loops over presets; plugin objects already registered per entry — rule-existence check composes from `entry.plugins` + `entry.rules`.
**Breaking changes (consumers):** stricter/different lint results from unicorn 65 + boundaries 6 + convex 2 → major version 2.0.0.
**New dependencies:** none.

## User Journey

1. Consumer bumps `@vllnt/eslint-config` to ^2.0.0 → `pnpm lint` runs clean or surfaces legitimate new findings
2. Consumer on convex preset → needs `convex >=1.34.1` (documented in changelog)
Error: configured rule missing from plugin (rename/removal slipped through) → smoke test fails in CI before publish, consumer never sees "Definition for rule not found"

## Acceptance Criteria

- [x] AC-1: GIVEN fresh install WHEN `pnpm test` THEN all presets resolve, all configured rules exist in their plugins
- [x] AC-2: GIVEN target dep versions WHEN linting a TS fixture with each preset THEN ESLint exits without "rule not found"/config errors
- [x] AC-3: GIVEN boundaries 6 WHEN base/boundaries preset loads THEN `no-private` is explicitly `['error', { allowUncles: true }]`
- [x] AC-4: GIVEN unicorn 64 WHEN base preset loads THEN every active unicorn rule appears in flat/core/unicorn.js — `error`, or `off` with the exclusion rationale documented
- [x] AC-E1: GIVEN a pinned rule missing from its plugin WHEN `pnpm test` THEN suite fails naming the rule

## Scope

- [x] 1. Add rule-existence smoke test (RED confirmed at baseline) → AC-1, AC-E1
- [x] 2. Add tests/preset-lint.test.js: programmatic ESLint run per preset on fixture (catches option-schema breaks the existence test can't) → AC-2
- [x] 3. Bump dep ranges in package.json + refresh lockfile (targets adjusted to newest-mature, see Notes) → AC-1
- [x] 4. Migrate deprecated unicorn pins (no-instanceof-array → no-instanceof-builtins, no-array-push-push → prefer-single-call) → AC-1
- [x] 5. Unicorn curation screen: 39 undecided rules (34 v62-era gaps + 5 new in v63/64) — 38 → `error`, `isolated-functions` → `off` (exclusion) → AC-4
- [x] 6. flat/core/boundaries.js: pin `no-private` `['error', { allowUncles: true }]`, accept v6 `dependency-nodes` default → AC-3
- [x] 7. flat/convex.js: pin `no-filter-in-query` + `no-collect-in-query` as `error`, comment 4 → 6 → AC-2
- [x] 8. CHANGELOG 2.0.0 + version bump → release via CI on merge

## Quality Checklist

- [ ] All ACs passing
- [ ] No regressions (existing 43 assertions still green)
- [ ] Consumer migration notes in CHANGELOG (convex peer, no-private, new findings expected)

## Test Strategy
Runner: node:test (tests/smoke.test.js) | E2E: tests/preset-lint.test.js (NEW, permanent) — real ESLint per preset on fixture | TDD: RED → GREEN per AC
AC-1/AC-E1 → rule-existence smoke test | AC-2 → preset-lint integration test | AC-3/AC-4 → smoke assertions on entry rules
Mocks: none — real plugin packages, real ESLint.

## Analysis

**Assumptions:** "All plugin majors run on ESLint 9" → VALID (peer ranges verified per package) | "Unicorn rename/removal is the only pinned-rule break" → RISKY (release notes for 63/64 list no removals, but pinned deprecated rules from pre-62 eras — e.g. `no-instanceof-array`, `no-array-push-push` — could be aliases; fixture lint + rule-existence test catches) | "Convex 2.0 has no breaking changes" → RISKY (major bump rationale undocumented; mitigated by explicit rule pins + smoke test)
**Blind Spots:** [integration] `eslint-plugin-css-modules` (2.12.0, last era ESLint <9 API) and `write-good-comments` (0.2.0) are unmaintained — fine today, will block ESLint 10 later. [ops] consumers pinned to `convex <1.34.1` break on convex preset.
**Failure Hypothesis:** IF unicorn 65 removed/renamed a pinned rule beyond the two documented THEN consumers hit "Definition for rule not found" at lint time BECAUSE smoke tests never validated rule existence → mitigation: scope item 1 lands FIRST (RED before bump).
**The Real Question:** confirmed — upgrade now while majors still support ESLint 9; waiting until ESLint 10 forces everything at once would couple two risk surfaces.
**Open Items:** [decided 2026-06-10] boundaries: re-enable `no-private` explicitly + accept expanded `dependency-nodes` → update spec ✓ | [decided 2026-06-10] convex: pin both new rules as `error` (restores "all official rules" invariant) → update spec ✓ | [decided 2026-06-10] unicorn new rules: adopt-all-as-error minus documented conflict screen (user initially picked blanket adopt-all; amended after counter: existing deliberate `off` pattern + upstream removed `better-regex` this major as broken) → update spec ✓ | [no action] TS 6 devDep bump — zero consumer impact, skip

## Notes

**Deviations from plan (all forced by environment, decided in-flight):**
1. `minimumReleaseAge` (7 days, pnpm supply-chain policy) blocked unicorn 65.0.x, functional 10.0.0, typescript-eslint 8.61.0, next 16.2.8/9, turbo 2.9.17 — all published after 2026-06-03. Targets moved to newest-mature: unicorn **64.0.0 capped `64.x`** (caret would float consumers onto 65 where `better-regex` is removed while still pinned → consumer lint crashes; rename `prefer-dom-node-dataset`→`dom-node-dataset` is not bi-compatible, so the cap is mandatory, not cosmetic), functional stays ^9 (zero config impact), typescript-eslint ^8.60.0, next ^16.2.7, turbo ^2.9.16.
2. Curation scope expanded: exhaustiveness test revealed 34 active v62-era rules never decided (pre-existing gap) on top of the 5 new v63/64 rules. All 39 screened: 38 `error`, `isolated-functions` `off`.
3. Audit surfaced 5 lockfile vulns (1 high lodash via eslint-plugin-css-modules) → fixed via full lockfile regeneration + `turbo >= 2.9.14` override. Final: 0 vulnerabilities.
4. New tests live in tests/rules.test.js (new file, additive) rather than appended to smoke.test.js; test script now `node --test tests/*.test.js`.
5. Pre-existing gap noticed, NOT fixed (out of scope): convex preset standalone usage (`export default [...convex]`) has no TS parser — type-annotated files fatal under espree unless composed with base. Documented here for a follow-up.

**Queued follow-ups:** unicorn 65 migration (after ~2026-06-15 when mature: drop `better-regex`, rename `prefer-dom-node-dataset`, screen ~33 new v65 rules — exhaustiveness test will force it); functional 10 (after 2026-06-10); ESLint 10 (blocked on react/jsx-a11y peers).

## Timeline

| Action | Timestamp | Duration | Notes |
|--------|-----------|----------|-------|
| plan | 2026-06-10 | - | Created |
| ship | 2026-06-10 | ~1h | All 8 scope items, 61/61 tests, 0 vulns |
