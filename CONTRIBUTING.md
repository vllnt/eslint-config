# Contributing to @vllnt/eslint-config

Thanks for your interest in contributing! This guide covers how to get started.

## Getting Started

1. Fork and clone the repo
2. Install dependencies: `pnpm install`
3. Run tests: `pnpm test`

## Development

### Project Structure

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

### Adding a New Preset

1. Create `flat/core/{preset}.js` with the config fragment
2. Create `flat/{preset}.js` that exports the preset array
3. Add the export to `flat/index.js`
4. Add the export path to `package.json` `exports` field
5. Add tests in `tests/smoke.test.js`

### Adding a New Convex Rule

1. Create the rule in `flat/convex-rules/{rule-name}.js`
2. Register it in `flat/convex-plugin.js`
3. Enable it in `flat/core/convex.js`
4. Add tests

## Pull Requests

- Branch from `main`
- Use conventional commits: `feat(scope):`, `fix(scope):`, `chore(scope):`
- Keep PRs focused — one change per PR
- All tests must pass: `pnpm test`

## Reporting Issues

Open a [GitHub issue](https://github.com/vllnt/eslint-config/issues). Include:
- ESLint and Node.js version
- Your `eslint.config.js`
- The error or unexpected behavior

## Community

- [Discord](https://bntvllnt.com/discord) — questions and discussion
- [X / Twitter](https://bntvllnt.com/x) — updates
- [GitHub](https://bntvllnt.com/github) — issues and PRs
