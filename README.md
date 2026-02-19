# @vllnt/eslint-config

[![npm version](https://img.shields.io/npm/v/@vllnt/eslint-config)](https://www.npmjs.com/package/@vllnt/eslint-config)
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

## Configs

| Export | Use case |
|--------|----------|
| `@vllnt/eslint-config` | Base — eslint + typescript-eslint strict + prettier |
| `@vllnt/eslint-config/nextjs` | Next.js apps (includes React + a11y) |
| `@vllnt/eslint-config/react` | React apps without Next.js |
| `@vllnt/eslint-config/nodejs` | Node.js backends |
| `@vllnt/eslint-config/convex` | Convex backends |
| `@vllnt/eslint-config/turbo` | Turborepo cache rules (opt-in) |
| `@vllnt/eslint-config/boundaries` | Architecture boundary enforcement (opt-in) |

## Usage

Each preset is an array — spread it into your flat config:

```js
// eslint.config.js
import { nextjs } from '@vllnt/eslint-config/nextjs'

export default [...nextjs]
```

All presets include `projectService: true` by default for type-aware linting.

### Composing multiple configs

```js
import { nodejs } from '@vllnt/eslint-config/nodejs'
import { turbo } from '@vllnt/eslint-config/turbo'
import { boundaries } from '@vllnt/eslint-config/boundaries'

export default [
  ...nodejs,
  ...turbo,
  ...boundaries,
  {
    settings: {
      'boundaries/include': ['src/**/*.ts*'],
      'boundaries/elements': [
        { type: 'core', pattern: 'src/core/**' },
        { type: 'utils', pattern: 'src/utils/**' },
      ],
    },
    rules: {
      'boundaries/element-types': ['error', {
        default: 'allow',
        rules: [{ from: 'core', disallow: ['utils'] }],
      }],
    },
  },
]
```

### Convex

Convex config can be used standalone or composed with base for full coverage:

```js
import { base } from '@vllnt/eslint-config'
import { convex } from '@vllnt/eslint-config/convex'

export default [...base, ...convex]
```

### Overriding rules

Append an object after the spread to override any rule:

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

## License

[MIT](LICENSE)
