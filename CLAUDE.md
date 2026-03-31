# @vllnt/eslint-config

Strict ESLint flat config for TypeScript projects. Scoped to `@vllnt` npm org.

## Publishing (local)

```sh
# 1. Auth (one-time, or when token expires)
npm login

# 2. Run tests
pnpm test

# 3. Bump version (creates commit + tag)
pnpm version patch   # 0.1.0 → 0.1.1
pnpm version minor   # 0.1.0 → 0.2.0
pnpm version major   # 0.1.0 → 1.0.0

# 4. Publish
pnpm publish --access public

# 5. Push commit + tag to remote
git push && git push --tags
```

`prepublishOnly` runs tests automatically before publish.

## Publishing (CI)

1. Bump version in `package.json`
2. Add entry to `CHANGELOG.md` (CI enforces both)
3. Merge PR → CI auto-detects new version, creates git tag, publishes to npm,
   and creates GitHub Release with notes from CHANGELOG.md

Non-release pushes to main publish a canary version automatically.

## Project structure

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
| `npm view @vllnt/eslint-config` | Check published version |
