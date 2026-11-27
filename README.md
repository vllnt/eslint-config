<div align="center">

# @vllnt/eslint-config

**Strict, opinionated ESLint flat config for TypeScript projects.**
Every rule enforces `error` — no warnings, no compromises.

[![npm version](https://img.shields.io/npm/v/@vllnt/eslint-config?color=cb0000&label=npm)](https://www.npmjs.com/package/@vllnt/eslint-config)
[![CI](https://img.shields.io/github/actions/workflow/status/vllnt/eslint-config/ci.yml?label=CI)](https://github.com/vllnt/eslint-config/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)
[![ESLint](https://img.shields.io/badge/eslint-%3E%3D9-4B32C3)](https://eslint.org)

</div>

---

## Why

- **ESLint v9+ flat config only** — no legacy `.eslintrc`
- **TypeScript-first** with `strictTypeChecked` + `stylisticTypeChecked`
- **Prettier built-in** — formatting as lint errors, zero config
- **8 presets** — Base, React, Next.js, Node.js, Convex, Turbo, Boundaries, Playwright — plus a shared `ignores` list
- **Composable** — spread arrays, override anything

## Install

```sh
pnpm add -D @vllnt/eslint-config@^2 @typescript/native@npm:typescript@^7.0.2 eslint@^9 prettier typescript@npm:@typescript/typescript6@^6.0.2
```

Version 2 follows the official TypeScript 7 side-by-side migration arrangement:
`tsc` runs TypeScript 7, while type-aware ESLint tooling imports the TypeScript 6
JavaScript API through the canonical `typescript` package. TypeScript 5 is no
longer supported.

## For coding agents

The docs ship inside the package, in `node_modules/@vllnt/eslint-config/`:
`README.md`, `llms.txt` and `CHANGELOG.md`. They match the installed version.
Read them before writing or changing an ESLint config that uses this package.

## Quick start

```js
// eslint.config.js
import { nextjs } from "@vllnt/eslint-config/nextjs";

export default [...nextjs];
```

Each preset is an array — spread it into your flat config. Presets take no options;
change a rule by appending your own config object (see below). The root entry has
named exports only; each subpath also has a default export. Base and its React,
Next.js, and Node.js variants enable `projectService: true` for type-aware linting.
Convex also enables it; Turbo, Boundaries and Playwright are opt-in additions, not
replacements for a language preset.

## Presets

| Import                            | Use case                                               |
| --------------------------------- | ------------------------------------------------------ |
| `@vllnt/eslint-config`            | Base — TypeScript strict + Prettier + import sorting   |
| `@vllnt/eslint-config/nextjs`     | Next.js apps (includes React + a11y + core web vitals) |
| `@vllnt/eslint-config/react`      | React apps without Next.js                             |
| `@vllnt/eslint-config/nodejs`     | Node.js backends                                       |
| `@vllnt/eslint-config/convex`     | Convex backends (4 official + 7 custom rules)          |
| `@vllnt/eslint-config/turbo`      | Turborepo cache rules (opt-in)                         |
| `@vllnt/eslint-config/boundaries` | Architecture boundary enforcement (opt-in)             |
| `@vllnt/eslint-config/playwright` | Playwright test and config files (opt-in)              |
| `@vllnt/eslint-config/ignores`    | Shared ignores for build and test output (opt-in)      |

## Composing presets

Mix and match — presets are arrays:

```js
import { nodejs } from "@vllnt/eslint-config/nodejs";
import { turbo } from "@vllnt/eslint-config/turbo";

export default [...nodejs, ...turbo];
```

Override any rule by appending a config object:

```js
import { nodejs } from "@vllnt/eslint-config/nodejs";

export default [
  ...nodejs,
  {
    rules: {
      "max-lines-per-function": ["error", { max: 50 }],
    },
  },
];
```

## Playwright

An opt-in addition, like Turbo and Boundaries: spread it after a language preset, which
registers the plugins and rules it adjusts.

```js
import { nextjs } from "@vllnt/eslint-config/nextjs";
import { playwright } from "@vllnt/eslint-config/playwright";

export default [...nextjs, ...playwright];
```

It applies to `**/tests/e2e/**/*.{spec,setup}.ts`, `**/e2e/**/*.spec.ts` and
`**/playwright.config.{ts,mts}`, and relaxes three rules there:

| Rule                                   | Change                        | Why                                                                          |
| -------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| `functional/no-loop-statements`        | off                           | Tests and projects are generated per viewport, locale or route               |
| `max-lines-per-function`               | off                           | A `describe` block or setup step covers a whole page or sign-in flow         |
| `@typescript-eslint/naming-convention` | object literal keys unchecked | Expected-data tables use the page's labels and the API's field names as keys |

Everything else stays on, including `write-good-comments` and
`unicorn/prevent-abbreviations`: comments and names in tests follow the same rules as
app code. Variable and function names are still checked, and so are helpers in
`tests/e2e/` that are not `*.spec.ts` or `*.setup.ts`.

## Shared ignores

```js
import { ignores } from "@vllnt/eslint-config/ignores";
import { nextjs } from "@vllnt/eslint-config/nextjs";

export default [...ignores, ...nextjs];
```

`ignores` covers `coverage/`, `playwright-report/`, `test-results/`, `.turbo/` and
`.worktrees/` at any depth, and `dist/` and `build/` at the config root, so a source
folder with one of those names deeper in the tree is still linted. ESLint already
ignores `node_modules/` and `.git/`, and the Next.js preset adds its own output. Tool
config files such as `next.config.*` or `postcss.config.*` stay yours to ignore,
because whether they sit inside your `tsconfig.json` is a project decision.

## Inspecting and profiling ESLint

Run these commands from the consuming project's root so they use its local ESLint,
configuration, TypeScript project, and installed version of this package. No extra
inspector dependency is required.

### Inspect the effective configuration

```sh
pnpm exec eslint --inspect-config
```

ESLint downloads on demand (via `npx`) and launches the Config Inspector for the
project's config file; it takes no file argument. Use its file-matching view to see
which config objects match a path, where a rule was defined, and the final rule
options. Check representative files from each environment (for example,
application code, tests, generated code, and Convex code) because flat config is
resolved per file.

The inspector explains configuration; it does **not** profile lint performance.

### Find slow rules

```sh
TIMING=1 pnpm exec eslint .
```

`TIMING=1` prints the ten rules with the highest aggregate execution time after a
normal lint run. Set `TIMING=all` to display every rule. Treat the percentages as
directional: type-aware rules often share the one-time cost of creating a
TypeScript program, so one cold run does not prove that the highest-ranked rule is
the root cause.

### Find slow files and collect granular stats

```sh
pnpm exec eslint . \
  --stats \
  --format json-with-metadata \
  --output-file eslint-stats.json
```

The built-in `json-with-metadata` formatter preserves each file's `stats`,
including parse, fix, and per-rule lint timings. Use the resulting JSON with a
stats-aware analyzer or a small script to group by `filePath` and rule ID. Delete
or gitignore the generated report; it can contain local paths and lint messages.

### Profiling best practices

1. Profile the same file set and command used by CI, without `--fix`.
2. Run once to warm the operating system's file cache, then compare several runs.
   Each CLI run is a fresh process, so TypeScript program setup is part of every timing.
3. Disable ESLint's result cache while benchmarking; cached files have no useful
   rule timings.
4. Separate parse time from rule time. High parse time usually points to typed
   linting or TypeScript project scope rather than an individual rule.
5. Use Config Inspector on the slowest representative files to confirm which
   presets and type-aware rules actually apply before changing configuration.
6. Prefer narrowing ignores, file globs, or TypeScript project scope over disabling
   correctness rules. Re-run the same baseline after every change.

See ESLint's official documentation for [Config Inspector](https://eslint.org/docs/latest/use/configure/debug#use-the-config-inspector),
[rule profiling](https://eslint.org/docs/latest/extend/custom-rules#profile-rule-performance),
and [stats data](https://eslint.org/docs/latest/extend/stats).

---

## What's included

### Base (also included by React, Next.js, and Node.js)

| Plugin                                                                                            | What it does                                 |
| ------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [@eslint/js](https://eslint.org/docs/latest/rules/)                                               | ESLint recommended rules                     |
| [typescript-eslint](https://typescript-eslint.io/)                                                | `strictTypeChecked` + `stylisticTypeChecked` |
| [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)                      | Prettier as ESLint errors                    |
| [eslint-plugin-perfectionist](https://perfectionist.dev/)                                         | Sorts objects, object types, interfaces, unions, enums, JSX props, named exports, Map entries and `includes` arrays |
| [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)                    | Modern JS best practices                     |
| [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort)    | Import ordering                              |
| [eslint-plugin-functional](https://github.com/eslint-functional/eslint-plugin-functional)         | Functional patterns (no loops, readonly)     |
| [eslint-plugin-write-good-comments](https://github.com/kantord/eslint-plugin-write-good-comments) | Comment quality                              |

Plus: strict naming conventions (camelCase, PascalCase types, T-prefixed generics), no enums (union types enforced via AST selector).
In `.tsx` and `*.decorator.ts` files the naming rule checks only function names (camelCase or PascalCase).

### React additions

| Plugin                                                                          | What it does              |
| ------------------------------------------------------------------------------- | ------------------------- |
| [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)        | Recommended + jsx-runtime |
| [eslint-plugin-react-hooks](https://react.dev/reference/rules/rules-of-hooks)   | `recommended-latest`: Rules of Hooks, exhaustive deps, React Compiler rules |
| [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)  | Accessibility             |
| [eslint-plugin-css-modules](https://github.com/atfzl/eslint-plugin-css-modules) | Registered only: `no-unused-class` is off and no other rule is on |

### Next.js additions

Everything in React, plus:

| Plugin                                                                              | What it does                                |
| ----------------------------------------------------------------------------------- | ------------------------------------------- |
| [@next/eslint-plugin-next](https://nextjs.org/docs/app/api-reference/config/eslint) | Recommended + core web vitals (all `error`) |

- **Route handlers** (`app/**/route.{js,jsx,ts}`) may export `GET`, `HEAD`, `POST`,
  `PUT`, `PATCH`, `DELETE` and `OPTIONS` as functions. Any other name keeps the base
  naming rule, so `FETCH`, `Get`, a non-exported `GET`, or `GET` outside a route file
  still fail. Config exports such as `dynamic`, `revalidate` and `runtime` are
  camelCase and already pass. `route.tsx` follows the `.tsx` rule, which accepts
  PascalCase functions, so `GET` and JSX helpers pass there.
- Under `app/api/**/route.*`, the naming rule is off, and `no-restricted-syntax`
  only limits function exports to those methods and `generateStaticParams`; the base
  enum and `| undefined` bans do not apply in those files.
- `functional/no-loop-statements` stays on in route handlers; build the response with
  `map` or `reduce`.
- `.next/`, `out/`, `build/` and `next-env.d.ts` are ignored.
- `max-lines-per-function` is off in pages and layouts.

In every preset, object and type property names that need quotes (`'content-type'`,
`'@type'`, `'x-default'`) are exempt from the naming convention, because an external
format fixes their spelling. Names that do not need quotes (`user_id`) are still checked
wherever the full naming rule applies (not in `.tsx`, `*.decorator.ts` or `app/api/**/route.*`).

### Opt-in

| Preset     | Plugin                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| Turbo      | [eslint-plugin-turbo](https://turbo.build/repo/docs/reference/eslint-plugin-turbo) cache rules              |
| Boundaries | [eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) recommended rules; define `settings['boundaries/elements']` in your config, since with none nothing is enforced |

---

## Convex preset

The Convex preset enforces backend best practices with **4 official rules** + **7 custom rules** bundled as `eslint-plugin-convex-rules`.

### Setup

```js
// Standalone
import { convex } from "@vllnt/eslint-config/convex";

export default [...convex];
```

```js
// With base (recommended)
import { base } from "@vllnt/eslint-config";
import { convex } from "@vllnt/eslint-config/convex";

export default [...base, ...convex];
```

### Official rules (`@convex-dev`)

| Rule                                | Catches                                        |
| ----------------------------------- | ---------------------------------------------- |
| `no-old-registered-function-syntax` | Deprecated function syntax                     |
| `require-args-validator`            | Missing `args` validator                       |
| `explicit-table-ids`                | Implicit table ID types                        |
| `import-wrong-runtime`              | Wrong runtime imports (Node in Convex runtime) |

### Custom rules (`convex-rules`)

| Rule                        | Catches                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `standard-filenames`        | Factories outside `queries.ts`, `mutations.ts`, `actions.ts`, `internal_mutations.ts`, `node_actions.ts` |
| `namespace-separation`      | `query()` in `mutations.ts`, `mutation()` in `queries.ts`    |
| `snake-case-filenames`      | Non-`snake_case` filenames in `convex/` (hyphens, camelCase); names starting uppercase are exempt |
| `no-bare-v-any`             | `v.any()` outside `validators.ts`                            |
| `require-returns-validator` | Missing `returns` validator in factory config                |
| `no-query-in-loop`          | N+1 queries (`ctx.db.query`/`get`/`runQuery` inside loops)   |
| `no-filter-on-query`        | `.filter()` on query chains (use `.withIndex()`)             |

### Auto-applied overrides

- **Config files** (`auth.ts`, `auth.config.ts`, `convex.config.ts` at the root of `convex/` or `src/component/`) — exempt from `snake-case-filenames` and `explicit-module-boundary-types`
- **Migration files** (`convex/migrations/**`) — exempt from `standard-filenames`, `namespace-separation`, `no-query-in-loop`
- **Generated/test files** (`convex/_generated/**`, `*.test.ts`, `convex/testing/**`) — excluded from the Convex rules (other presets in your config still apply)
- Sandboxed component sources under `src/component/**` receive the same rules and exclusions, except `snake-case-filenames`, which only checks files under `convex/`.

### Project-specific overrides

```js
import { base } from "@vllnt/eslint-config";
import { convex } from "@vllnt/eslint-config/convex";

export default [
  ...base,
  ...convex,

  // Exempt "use node" action files from import-wrong-runtime
  {
    files: ["convex/agents/actions.ts"],
    rules: { "@convex-dev/import-wrong-runtime": "off" },
  },
];
```

### Enforced file structure

```
convex/
  {domain}/
    queries.ts              query(), internalQuery()
    mutations.ts            mutation(), internalMutation()
    actions.ts              action(), internalAction()
    node_actions.ts         action(), internalAction() in the Node.js runtime ("use node")
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

| Package                         | Required                                       |
| ------------------------------- | ---------------------------------------------- |
| `eslint` >= 9                   | Yes                                            |
| `prettier` >= 3                 | Yes                                            |
| `typescript` >= 6.0.2 and < 6.1 | Yes for the root entry and the Base, React, Next.js, Node.js and Convex presets (type-aware linting through `typescript-eslint`); not needed when you import only Turbo, Boundaries, Playwright or ignores |

Install `@typescript/native` as `npm:typescript@^7.0.2` when using TypeScript 7
as the build compiler.

## VS Code

Add to `.vscode/settings.json` for monorepo support:

```json
{
  "eslint.workingDirectories": ["./apps/your-app", "./packages/your-package"]
}
```

## Documentation and support

- [LLM index](llms.txt) · [Changelog](CHANGELOG.md)
- [Contributing](https://github.com/vllnt/eslint-config/blob/main/CONTRIBUTING.md) · [Issues](https://github.com/vllnt/eslint-config/issues)
- [Security policy and private vulnerability reporting](https://github.com/vllnt/eslint-config/blob/main/SECURITY.md)

Stable releases use the npm `latest` tag. `@canary` selects moving prerelease
builds; pin and test them before adoption.

## Related packages

| Package                                                          | Use it for                                                                                                                       |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [`@vllnt/typescript`](https://oss.vllnt.com/packages/typescript) | Shared `tsconfig` presets. Type-aware linting here reads your `tsconfig.json`; use that package to set the compiler options, this one to lint. |

## Author

Built by [bntvllnt](https://github.com/bntvllnt) · [bntvllnt.com](https://bntvllnt.com).
Part of [@vllnt](https://github.com/vllnt). [Sponsor the work](https://github.com/sponsors/bntvllnt).

## License

[MIT](LICENSE)

---

Part of vllnt oss: https://oss.vllnt.com
