# @vllnt/eslint-config

[![npm version](https://img.shields.io/npm/v/@vllnt/eslint-config)](https://www.npmjs.com/package/@vllnt/eslint-config)
[![CI](https://github.com/vllnt/eslint-config/actions/workflows/ci.yml/badge.svg)](https://github.com/vllnt/eslint-config/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Strict, opinionated ESLint flat config for TypeScript projects. Every rule enforces `error` — no warnings.

- ESLint v9+ flat config only
- TypeScript-first with `strictTypeChecked`
- Prettier formatting built-in
- React, Next.js, Node.js, and Convex presets
- Opt-in Turborepo and architecture boundary configs

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

| Export | Use case |
|--------|----------|
| `@vllnt/eslint-config` | Base — eslint + typescript-eslint strict + prettier |
| `@vllnt/eslint-config/nextjs` | Next.js apps (includes React + a11y) |
| `@vllnt/eslint-config/react` | React apps without Next.js |
| `@vllnt/eslint-config/nodejs` | Node.js backends |
| `@vllnt/eslint-config/convex` | Convex backends (11 rules + 7 custom) |
| `@vllnt/eslint-config/turbo` | Turborepo cache rules (opt-in) |
| `@vllnt/eslint-config/boundaries` | Architecture boundary enforcement (opt-in) |

## Composing presets

```js
import { nodejs } from '@vllnt/eslint-config/nodejs'
import { turbo } from '@vllnt/eslint-config/turbo'

export default [...nodejs, ...turbo]
```

Override any rule by appending an object:

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

## Convex preset

The Convex preset enforces backend best practices with **4 official rules** + **7 custom rules** bundled as `eslint-plugin-convex-rules`.

### Setup

Standalone:

```js
import { convex } from '@vllnt/eslint-config/convex'

export default [...convex]
```

With base (recommended — adds TypeScript strict, prettier, import sorting):

```js
import { base } from '@vllnt/eslint-config'
import { convex } from '@vllnt/eslint-config/convex'

export default [...base, ...convex]
```

### Rules included

**Official `@convex-dev` rules:**

| Rule | What it catches |
|------|----------------|
| `@convex-dev/no-old-registered-function-syntax` | Deprecated function syntax |
| `@convex-dev/require-args-validator` | Missing `args` validator |
| `@convex-dev/explicit-table-ids` | Implicit table ID types |
| `@convex-dev/import-wrong-runtime` | Wrong runtime imports (Node in Convex runtime) |

**Custom `convex-rules` (bundled):**

| Rule | What it catches |
|------|----------------|
| `convex-rules/standard-filenames` | Factories outside `queries.ts`, `mutations.ts`, `actions.ts`, `internal_mutations.ts` |
| `convex-rules/namespace-separation` | `query()` in `mutations.ts`, `mutation()` in `queries.ts`, etc. |
| `convex-rules/snake-case-filenames` | Hyphens in `convex/` filenames (must be `snake_case`) |
| `convex-rules/no-bare-v-any` | `v.any()` outside `validators.ts` — use named aliases |
| `convex-rules/require-returns-validator` | Missing `returns` validator in factory config |
| `convex-rules/no-query-in-loop` | N+1 queries (`ctx.db.query`/`get`/`runQuery` inside loops) |
| `convex-rules/no-filter-on-query` | `.filter()` on query chains — use `.withIndex()` |

Plus `@typescript-eslint/explicit-module-boundary-types` for explicit return types on Convex functions.

### Auto-applied overrides

The preset automatically relaxes rules where needed:

- **Config files** (`auth.ts`, `auth.config.ts`, `convex.config.ts`) — exempt from `snake-case-filenames` and `explicit-module-boundary-types`
- **Migration files** (`convex/migrations/**`) — exempt from `standard-filenames`, `namespace-separation`, and `no-query-in-loop`
- **Generated files** (`convex/_generated/**`), **test files** (`*.test.ts`), and **test helpers** (`convex/testing/**`) are excluded entirely

### Project-specific overrides

Add overrides after the preset for project-specific exemptions:

```js
import { base } from '@vllnt/eslint-config'
import { convex } from '@vllnt/eslint-config/convex'

export default [
  ...base,
  ...convex,

  // Exempt "use node" action files from import-wrong-runtime (known plugin bug)
  {
    files: ['convex/agents/actions.ts', 'convex/connectors/routing/actions.ts'],
    rules: {
      '@convex-dev/import-wrong-runtime': 'off',
    },
  },

  // Allow intentional query-in-loop for polling patterns
  {
    files: ['convex/agents/mutations.ts'],
    rules: {
      'convex-rules/no-query-in-loop': 'off',
    },
  },
]
```

### Convex file structure convention

The rules enforce this standard structure:

```
convex/
  {domain}/
    queries.ts              query(), internalQuery()
    mutations.ts            mutation(), internalMutation()
    actions.ts              action(), internalAction()
    internal_mutations.ts   internalMutation() (optional split)
    validators.ts           v.* validators + types (v.any() aliases go here)
    schema.ts               table definitions
  lib/
    validators.ts           shared v.any() aliases
  _generated/               auto-generated (excluded from linting)
  migrations/               relaxed rules (one-shot scripts)
```

**Key conventions:**
- Factories (`query()`, `mutation()`, `action()`) only in standard-named files
- Each factory type in its designated file (queries in `queries.ts`, mutations in `mutations.ts`)
- `snake_case` filenames (underscores, not hyphens)
- `v.any()` only in `validators.ts` files — define named aliases instead
- Every factory must have both `args` and `returns` validators
- No `ctx.db.query()`/`get()` inside loops — use `Promise.all()` with `.map()`
- No `.filter()` on queries — use `.withIndex()`

## What's included

### Base (all presets)

- **[@eslint/js](https://eslint.org/docs/latest/rules/)** recommended rules
- **[typescript-eslint](https://typescript-eslint.io/)** `strictTypeChecked` + `stylisticTypeChecked`
- **[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)** + **[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)** formatting
- **[eslint-plugin-perfectionist](https://perfectionist.dev/)** import/object/type sorting
- **[eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)** modern JS patterns
- **[eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)** import ordering
- **[eslint-plugin-functional](https://github.com/eslint-functional/eslint-plugin-functional)** functional patterns (no loops, readonly)
- **[eslint-plugin-write-good-comments](https://github.com/kantord/eslint-plugin-write-good-comments)** comment quality
- Strict naming conventions (camelCase, PascalCase types, T-prefixed generics)
- No enums (union types enforced via AST selector)

### React preset additions

- **[eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)** recommended + jsx-runtime
- **[eslint-plugin-react-hooks](https://reactjs.org/docs/hooks-rules.html)** rules of hooks
- **[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)** accessibility
- **[eslint-plugin-css-modules](https://github.com/atfzl/eslint-plugin-css-modules)** CSS module validation

### Next.js preset additions

Everything in React, plus:

- **[@next/eslint-plugin-next](https://nextjs.org/docs/app/api-reference/config/eslint)** recommended + core-web-vitals (all upgraded to `error`)
- Route handler method restrictions (`GET`, `POST`, `PUT`, `DELETE`)
- Page/layout `max-lines-per-function` override

### Opt-in configs

- **Turbo** — [eslint-plugin-turbo](https://turbo.build/repo/docs/reference/eslint-plugin-turbo) recommended rules
- **Boundaries** — [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) plugin + recommended rules (you define your own element patterns)

## Peer dependencies

| Package | Required |
|---------|----------|
| `eslint` >= 9 | Yes |
| `typescript` >= 5 | Optional |
| `prettier` >= 3 | Yes |

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

## Releasing

```sh
pnpm version patch|minor|major   # bumps version, commits, tags
git push && git push --tags      # CI: test -> npm publish -> GitHub Release
```

## License

[MIT](LICENSE)
