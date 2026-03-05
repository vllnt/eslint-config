<div align="center">

# @vllnt/eslint-config

**Strict, opinionated ESLint flat config for TypeScript projects.**
Every rule enforces `error` — no warnings, no compromises.

[![npm version](https://img.shields.io/npm/v/@vllnt/eslint-config?color=cb0000&label=npm)](https://www.npmjs.com/package/@vllnt/eslint-config)
[![CI](https://img.shields.io/github/actions/workflow/status/vllnt/eslint-config/ci.yml?label=CI)](https://github.com/vllnt/eslint-config/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![ESLint](https://img.shields.io/badge/eslint-%3E%3D9-4B32C3)](https://eslint.org)

</div>

---

## Why

- **ESLint v9+ flat config only** — no legacy `.eslintrc`
- **TypeScript-first** with `strictTypeChecked` + `stylisticTypeChecked`
- **Prettier built-in** — formatting as lint errors, zero config
- **7 presets** — Base, React, Next.js, Node.js, Convex, Turbo, Boundaries
- **Composable** — spread arrays, override anything

## Install

```sh
pnpm add -D @vllnt/eslint-config eslint typescript prettier
```

## Quick start

```js
// eslint.config.js
import { nextjs } from '@vllnt/eslint-config/nextjs'

export default [...nextjs]
```

Each preset is an array — spread it into your flat config. All presets include `projectService: true` for type-aware linting.

## Presets

| Import | Use case |
|--------|----------|
| `@vllnt/eslint-config` | Base — TypeScript strict + Prettier + import sorting |
| `@vllnt/eslint-config/nextjs` | Next.js apps (includes React + a11y + core web vitals) |
| `@vllnt/eslint-config/react` | React apps without Next.js |
| `@vllnt/eslint-config/nodejs` | Node.js backends |
| `@vllnt/eslint-config/convex` | Convex backends (4 official + 7 custom rules) |
| `@vllnt/eslint-config/turbo` | Turborepo cache rules (opt-in) |
| `@vllnt/eslint-config/boundaries` | Architecture boundary enforcement (opt-in) |

## Composing presets

Mix and match — presets are arrays:

```js
import { nodejs } from '@vllnt/eslint-config/nodejs'
import { turbo } from '@vllnt/eslint-config/turbo'

export default [...nodejs, ...turbo]
```

Override any rule by appending a config object:

```js
import { nodejs } from '@vllnt/eslint-config/nodejs'

export default [
  ...nodejs,
  {
    rules: {
      'max-lines-per-function': ['error', { max: 50 }],
    },
  },
]
```

---

## What's included

### Base (all presets)

| Plugin | What it does |
|--------|-------------|
| [@eslint/js](https://eslint.org/docs/latest/rules/) | ESLint recommended rules |
| [typescript-eslint](https://typescript-eslint.io/) | `strictTypeChecked` + `stylisticTypeChecked` |
| [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) | Prettier as ESLint errors |
| [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) | Disables conflicting rules |
| [eslint-plugin-perfectionist](https://perfectionist.dev/) | Import/object/type sorting |
| [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) | Modern JS best practices |
| [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort) | Import ordering |
| [eslint-plugin-functional](https://github.com/eslint-functional/eslint-plugin-functional) | Functional patterns (no loops, readonly) |
| [eslint-plugin-write-good-comments](https://github.com/kantord/eslint-plugin-write-good-comments) | Comment quality |

Plus: strict naming conventions (camelCase, PascalCase types, T-prefixed generics), no enums (union types enforced via AST selector).

### React additions

| Plugin | What it does |
|--------|-------------|
| [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) | Recommended + jsx-runtime |
| [eslint-plugin-react-hooks](https://react.dev/reference/rules/rules-of-hooks) | Rules of hooks |
| [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) | Accessibility |
| [eslint-plugin-css-modules](https://github.com/atfzl/eslint-plugin-css-modules) | CSS module validation |

### Next.js additions

Everything in React, plus:

| Plugin | What it does |
|--------|-------------|
| [@next/eslint-plugin-next](https://nextjs.org/docs/app/api-reference/config/eslint) | Recommended + core web vitals (all `error`) |

Route handler method restrictions, page/layout `max-lines-per-function` override.

### Opt-in

| Preset | Plugin |
|--------|--------|
| Turbo | [eslint-plugin-turbo](https://turbo.build/repo/docs/reference/eslint-plugin-turbo) cache rules |
| Boundaries | [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) architecture enforcement |

---

## Convex preset

The Convex preset enforces backend best practices with **4 official rules** + **7 custom rules** bundled as `eslint-plugin-convex-rules`.

### Setup

```js
// Standalone
import { convex } from '@vllnt/eslint-config/convex'

export default [...convex]
```

```js
// With base (recommended)
import { base } from '@vllnt/eslint-config'
import { convex } from '@vllnt/eslint-config/convex'

export default [...base, ...convex]
```

### Official rules (`@convex-dev`)

| Rule | Catches |
|------|---------|
| `no-old-registered-function-syntax` | Deprecated function syntax |
| `require-args-validator` | Missing `args` validator |
| `explicit-table-ids` | Implicit table ID types |
| `import-wrong-runtime` | Wrong runtime imports (Node in Convex runtime) |

### Custom rules (`convex-rules`)

| Rule | Catches |
|------|---------|
| `standard-filenames` | Factories outside `queries.ts`, `mutations.ts`, `actions.ts` |
| `namespace-separation` | `query()` in `mutations.ts`, `mutation()` in `queries.ts` |
| `snake-case-filenames` | Hyphens in `convex/` filenames (must be `snake_case`) |
| `no-bare-v-any` | `v.any()` outside `validators.ts` |
| `require-returns-validator` | Missing `returns` validator in factory config |
| `no-query-in-loop` | N+1 queries (`ctx.db.query`/`get`/`runQuery` inside loops) |
| `no-filter-on-query` | `.filter()` on query chains (use `.withIndex()`) |

### Auto-applied overrides

- **Config files** (`auth.ts`, `auth.config.ts`, `convex.config.ts`) — exempt from `snake-case-filenames` and `explicit-module-boundary-types`
- **Migration files** (`convex/migrations/**`) — exempt from `standard-filenames`, `namespace-separation`, `no-query-in-loop`
- **Generated/test files** (`convex/_generated/**`, `*.test.ts`, `convex/testing/**`) — excluded entirely

### Project-specific overrides

```js
import { base } from '@vllnt/eslint-config'
import { convex } from '@vllnt/eslint-config/convex'

export default [
  ...base,
  ...convex,

  // Exempt "use node" action files from import-wrong-runtime
  {
    files: ['convex/agents/actions.ts'],
    rules: { '@convex-dev/import-wrong-runtime': 'off' },
  },
]
```

### Enforced file structure

```
convex/
  {domain}/
    queries.ts              query(), internalQuery()
    mutations.ts            mutation(), internalMutation()
    actions.ts              action(), internalAction()
    internal_mutations.ts   internalMutation() (optional split)
    validators.ts           v.* validators + types
    schema.ts               table definitions
  lib/
    validators.ts           shared v.any() aliases
  _generated/               auto-generated (excluded)
  migrations/               relaxed rules
```

---

## Peer dependencies

| Package | Required |
|---------|----------|
| `eslint` >= 9 | Yes |
| `prettier` >= 3 | Yes |
| `typescript` >= 5 | Optional |

## VS Code

Add to `.vscode/settings.json` for monorepo support:

```json
{
  "eslint.workingDirectories": [
    "./apps/your-app",
    "./packages/your-package"
  ]
}
```

## License

[MIT](LICENSE)
