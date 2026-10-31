# @vllnt/eslint-config

Strict ESLint flat config for TypeScript projects. Scoped to `@vllnt` npm org.

## Agent instructions

`AGENTS.md` is the sole agent-instruction source for this repository. Do not add
`CLAUDE.md` or `.claude` content.

## Project Structure

```
flat/           ← shipped code (included in npm tarball)
  index.js      ← barrel: re-exports all presets
  base.js       ← base config (TS strict + prettier)
  nextjs.js     ← Next.js preset
  nodejs.js     ← Node.js preset
  react.js      ← React preset
  convex.js     ← Convex preset
  turbo.js      ← Turborepo preset
  boundaries.js ← Architecture boundaries preset
  convex-plugin.js    ← convex-rules ESLint plugin
  convex-rules/       ← 7 custom Convex lint rules
  core/               ← shared config fragments
tests/
  smoke.test.js ← export/shape/hygiene tests (node:test)
  convex-rules.test.js ← custom Convex rule tests (RuleTester)
```

## Commands

| Command | What |
|---------|------|
| `pnpm test` | Smoke and Convex rule tests |
| `pnpm pack --dry-run` | Preview tarball contents |

## Architecture

- Each preset is a flat config array exported from `flat/{preset}.js`
- Config fragments live in `flat/core/{name}.js` and are composed into presets
- `flat/index.js` is the barrel that re-exports all presets
- Custom Convex rules live in `flat/convex-rules/` and are bundled via `flat/convex-plugin.js`
- Tests use `node:test` (no external test runner)

## Conventions

- All rules enforce `error` — never `warn` or `off`
- Presets are arrays — consumers spread them into their flat config
- No TypeScript source — all shipped code is plain JS
- `peerDependencies` for eslint, prettier, typescript
- `dependencies` for all plugins (consumers don't install them separately)

## Publishing

Nothing is published from a local machine. `.github/workflows/publish.yml` uses npm
trusted publishing (OIDC) with provenance and holds no npm token.

- Canary (`@canary`): every push to `main`, or a manual run on `main`.
- Stable (`@latest`): only a pushed `vX.Y.Z` tag on a `main` commit whose `package.json`
  version is `X.Y.Z` and whose `CHANGELOG.md` has a `## [X.Y.Z]` entry. Merging to `main`
  never publishes `@latest`.
