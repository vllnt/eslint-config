# @vllnt/eslint-config

Strict ESLint flat config for TypeScript projects. Scoped to `@vllnt` npm org.

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
```

## Commands

| Command | What |
|---------|------|
| `pnpm test` | Smoke tests (43 assertions) |
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

Push to main auto-detects new versions. If package.json version has no git tag,
CI creates the tag, publishes to npm, and creates a GitHub Release with notes
from CHANGELOG.md. Non-release pushes publish a canary version.
