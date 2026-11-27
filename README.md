# @vllnt/eslint-config

ESLint flat config presets for TypeScript, React, Next.js, Node.js, Convex, Turborepo and Playwright, with type-aware rules and Prettier, all at `error`.

## For coding agents

The docs ship inside the package, in `node_modules/@vllnt/eslint-config/`: `README.md`, `llms.txt` and `CHANGELOG.md`.
They match the installed version. Read them before writing or changing an ESLint config that uses this package.
Every export and every message this package reports is listed under [API](#api) and [Errors and fixes](#errors-and-fixes).

## When to use

Use it when:

- You lint a TypeScript project with ESLint 9 or 10 flat config (`eslint.config.js`) and want type-aware `typescript-eslint` rules, Prettier formatting and import sorting reported as errors.
- The project is React, Next.js (App Router), Node.js or Convex, optionally with Turborepo, Playwright e2e tests or architecture boundaries.
- You want one dev dependency that brings every plugin; you do not install the plugins yourself.

Do not use it when:

- You need warnings, per-preset options or a looser rule set: presets take no options and every rule is `error`. Compose `typescript-eslint` configs and the plugins directly.
- The project uses `.eslintrc` (ESLint 8 or older): this package is flat config only. Use the configs each plugin publishes for ESLint 8.
- Type-aware linting must run on TypeScript 5 or only on the TypeScript 7 native compiler: the presets need the TypeScript 6.0 JavaScript API. Use `typescript-eslint` configs that match your TypeScript version.

## Install

```sh
pnpm add -D @vllnt/eslint-config@^2 @typescript/native@npm:typescript@^7.0.2 eslint@^10 prettier typescript@npm:@typescript/typescript6@^6.0.2
```

`tsc` runs TypeScript 7 (`@typescript/native`), while type-aware linting imports the TypeScript 6 JavaScript API through the `typescript` package. ESLint 9 works too (`eslint@^9`). Stable releases use the npm `latest` tag; `@canary` is a moving prerelease.

## Quick start

```js
// eslint.config.js
import { nextjs } from "@vllnt/eslint-config/nextjs";

export default [...nextjs];
```

Run `pnpm exec eslint .`. Every linted `.ts` or `.tsx` file must be included by a `tsconfig.json`, because the presets turn on `projectService` for type-aware rules.

## API

Every entry point exports an array of flat config objects. Spread it into your config. The root entry has named exports only; each subpath also has a default export. `./package.json` is exported for tooling.

| Export | Import | What it is |
| --- | --- | --- |
| `base` | `import { base } from "@vllnt/eslint-config"` | TypeScript strict and stylistic type-checked rules, Prettier, import sorting, Unicorn, functional rules and comment checks ([reference](#base)) |
| `react` | `import { react } from "@vllnt/eslint-config/react"` | `base` plus React, React Hooks and jsx-a11y ([reference](#react)) |
| `nextjs` | `import { nextjs } from "@vllnt/eslint-config/nextjs"` | `react` plus the Next.js plugin, route handler names and build output ignores ([reference](#nextjs)) |
| `nodejs` | `import { nodejs } from "@vllnt/eslint-config/nodejs"` | `base` plus test-file and `*.decorator.ts` overrides ([reference](#nodejs)) |
| `convex` | `import { convex } from "@vllnt/eslint-config/convex"` | 4 `@convex-dev` rules and 7 `convex-rules` rules for `convex/` and `src/component/` ([reference](#convex)) |
| `turbo` | `import { turbo } from "@vllnt/eslint-config/turbo"` | Turborepo cache rules; an addition to a language preset ([reference](#turbo)) |
| `boundaries` | `import { boundaries } from "@vllnt/eslint-config/boundaries"` | Architecture boundaries rules; needs `settings["boundaries/elements"]` ([reference](#boundaries)) |
| `playwright` | `import { playwright } from "@vllnt/eslint-config/playwright"` | Overlay for Playwright spec, setup and config files ([reference](#playwright)) |
| `ignores` | `import { ignores } from "@vllnt/eslint-config/ignores"` | Shared ignores for build and test output ([reference](#ignores)) |

Every name above is also a named export of the root entry `@vllnt/eslint-config`.

### base

Also included by `react`, `nextjs` and `nodejs`.

| Plugin | What it does |
| --- | --- |
| [@eslint/js](https://eslint.org/docs/latest/rules/) | ESLint recommended rules (from `@eslint/js` 9 on both ESLint majors) |
| [typescript-eslint](https://typescript-eslint.io/) | `strictTypeChecked` + `stylisticTypeChecked`, with `projectService: true` |
| [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) | Prettier as ESLint errors |
| [eslint-plugin-perfectionist](https://perfectionist.dev/) | Sorts objects, object types, interfaces, unions, enums, JSX props, named exports, Map entries and `includes` arrays |
| [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) | A curated list of Unicorn rules |
| [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort) | Import and export ordering |
| [eslint-plugin-functional](https://github.com/eslint-functional/eslint-plugin-functional) | No loop statements, readonly types |
| [eslint-plugin-write-good-comments](https://github.com/kantord/eslint-plugin-write-good-comments) | Comment wording |

Also: naming conventions (camelCase, PascalCase types without `I` or `T` prefixes, `T`-prefixed type parameters), no enums and no `| undefined` unions on properties (`no-restricted-syntax`), at most 3 parameters, functions of at most 30 lines (70 in `.tsx` files in `react` and `nextjs`), nesting depth at most 3. Object and type property names that need quotes (`'content-type'`, `'@type'`) are exempt from the naming convention; names that do not need quotes (`user_id`) are still checked.

### react

Everything in `base`, plus:

| Plugin | What it does |
| --- | --- |
| [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) | Recommended + jsx-runtime, plus 24 more rules |
| [eslint-plugin-react-hooks](https://react.dev/reference/rules/rules-of-hooks) | `recommended-latest`: Rules of Hooks, exhaustive deps, React Compiler rules |
| [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) | Recommended accessibility rules |
| [eslint-plugin-css-modules](https://github.com/atfzl/eslint-plugin-css-modules) | Registered only: `no-unused-class` is off and no other rule is on |

In `.tsx` files, `unicorn/no-null`, `unicorn/no-nested-ternary` and `unicorn/filename-case` are off, and the naming rule checks only function names (camelCase or PascalCase); see [Limits and gotchas](#limits-and-gotchas).

### nextjs

Everything in `react`, plus [@next/eslint-plugin-next](https://nextjs.org/docs/app/api-reference/config/eslint) recommended and core web vitals rules, all at `error`.

- Route handlers (`app/**/route.{js,jsx,ts}`) may export `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` and `OPTIONS` as functions. Any other name keeps the base naming rule, so `FETCH`, `Get`, a non-exported `GET`, or `GET` outside a route file still fail. `route.tsx` follows the `.tsx` rule, which accepts PascalCase functions, so `GET` passes there.
- Under `app/api/**/route.*`, the naming rule is off, and `no-restricted-syntax` only limits function exports to those methods and `generateStaticParams`.
- `functional/no-loop-statements` stays on in route handlers.
- `.next/`, `out/`, `build/` and `next-env.d.ts` are ignored.
- `max-lines-per-function` is off in `app/**/page.*` and `app/**/layout.*`.

### nodejs

Everything in `base`, plus the overrides `react` and `nextjs` also have for these files: `@typescript-eslint/no-unsafe-member-access` and `max-lines-per-function` are off in `*.test.ts`, `*.spec.ts` and `*.e2e.ts`, and `*.decorator.ts` files check only function names.

### convex

| Rule | Catches |
| --- | --- |
| `@convex-dev/no-old-registered-function-syntax` | Deprecated function syntax |
| `@convex-dev/require-args-validator` | Missing `args` validator |
| `@convex-dev/explicit-table-ids` | Implicit table ID types |
| `@convex-dev/import-wrong-runtime` | Node.js imports in Convex runtime files |
| `convex-rules/standard-filenames` | Factories outside `queries.ts`, `mutations.ts`, `actions.ts`, `internal_mutations.ts`, `node_actions.ts` |
| `convex-rules/namespace-separation` | `query()` in `mutations.ts`, `mutation()` in `queries.ts` |
| `convex-rules/snake-case-filenames` | Non-`snake_case` filenames in `convex/` (hyphens, camelCase); names starting uppercase are exempt |
| `convex-rules/no-bare-v-any` | `v.any()` outside `validators.ts` |
| `convex-rules/require-returns-validator` | Missing `returns` validator in a factory config |
| `convex-rules/no-query-in-loop` | `ctx.db.query`, `ctx.db.get` or `ctx.runQuery` inside a loop |
| `convex-rules/no-filter-on-query` | `.filter()` on a query chain (use `.withIndex()`) |

`@typescript-eslint/explicit-module-boundary-types` is also on for Convex sources.

- Applies to `**/convex/**/*.ts` and `**/src/component/**/*.ts`.
- `_generated/`, `*.test.ts` and `testing/` are excluded from these rules; other presets in your config still apply.
- `auth.ts`, `auth.config.ts` and `convex.config.ts` are exempt from `snake-case-filenames` and `explicit-module-boundary-types`.
- `migrations/` is exempt from `standard-filenames`, `namespace-separation` and `no-query-in-loop`.

The file layout the rules expect:

```text
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

### turbo

[eslint-plugin-turbo](https://turbo.build/repo/docs/reference/eslint-plugin-turbo) recommended rules (`turbo/no-undeclared-env-vars`). Spread it after a language preset.

### boundaries

[eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) recommended settings and rules. It enforces nothing until you define `settings["boundaries/elements"]`; see [Common tasks](#enforce-architecture-boundaries).

### playwright

An overlay: spread it after a language preset, which registers the plugins and rules it adjusts. It applies to `**/tests/e2e/**/*.{spec,setup}.ts`, `**/e2e/**/*.spec.ts` and `**/playwright.config.{ts,mts}`.

| Rule | Change | Why |
| --- | --- | --- |
| `functional/no-loop-statements` | off | Tests and projects are generated per viewport, locale or route |
| `max-lines-per-function` | off | A `describe` block or setup step covers a whole page or sign-in flow |
| `@typescript-eslint/naming-convention` | object literal keys unchecked | Expected-data tables use the page's labels and the API's field names as keys |

Everything else stays on, including `write-good-comments` and `unicorn/prevent-abbreviations`. Helpers in `tests/e2e/` that are not `*.spec.ts` or `*.setup.ts` keep every rule.

### ignores

Ignores `coverage/`, `playwright-report/`, `test-results/`, `.turbo/` and `.worktrees/` at any depth, and `dist/` and `build/` at the config root, so a source folder with one of those names deeper in the tree is still linted. ESLint already ignores `node_modules/` and `.git/`; `nextjs` adds its own output.

## Common tasks

### Combine presets

```js
import { ignores } from "@vllnt/eslint-config/ignores";
import { nextjs } from "@vllnt/eslint-config/nextjs";
import { playwright } from "@vllnt/eslint-config/playwright";
import { turbo } from "@vllnt/eslint-config/turbo";

export default [...ignores, ...nextjs, ...turbo, ...playwright];
```

### Change a rule

Presets take no options. Append a config object; later objects win.

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

### Lint a Convex backend

```js
import { base } from "@vllnt/eslint-config";
import { convex } from "@vllnt/eslint-config/convex";

export default [
  ...base,
  ...convex,
  {
    files: ["convex/agents/actions.ts"],
    rules: { "@convex-dev/import-wrong-runtime": "off" },
  },
];
```

### Enforce architecture boundaries

```js
import { boundaries } from "@vllnt/eslint-config/boundaries";
import { nodejs } from "@vllnt/eslint-config/nodejs";

export default [
  ...nodejs,
  ...boundaries,
  {
    settings: {
      "boundaries/elements": [
        { pattern: "src/features/*", type: "feature" },
        { pattern: "src/shared/*", type: "shared" },
      ],
    },
  },
];
```

### Inspecting and profiling ESLint

Run these from the consuming project's root so they use its local ESLint, config and TypeScript project.

```sh
pnpm exec eslint --inspect-config
```

This opens the Config Inspector for the project's config file; it takes no file argument. Use its file view to see which config objects match a path and the final rule options. It explains configuration; it does not measure performance.

```sh
TIMING=1 pnpm exec eslint .
```

`TIMING=1` prints the ten rules with the highest total time (`TIMING=all` prints every rule). Type-aware rules share the one-time cost of creating a TypeScript program, so the top rule in one cold run is not proof of the cause.

```sh
pnpm exec eslint . --stats --format json-with-metadata --output-file eslint-stats.json
```

The JSON keeps each file's parse, fix and per-rule timings. Delete or gitignore the report; it contains local paths. When you compare runs, use the CI file set without `--fix` and without ESLint's cache, and run more than once. See ESLint's docs on the [Config Inspector](https://eslint.org/docs/latest/use/configure/debug#use-the-config-inspector), [rule profiling](https://eslint.org/docs/latest/extend/custom-rules#profile-rule-performance) and [stats](https://eslint.org/docs/latest/extend/stats).

### Use the ESLint extension for VS Code in a monorepo

```json
{
  "eslint.workingDirectories": ["./apps/your-app", "./packages/your-package"]
}
```

Put this in `.vscode/settings.json`.

## Errors and fixes

Messages that the presets and the bundled `convex-rules` report, and errors from common setup mistakes.

| Message or code | Cause | Fix |
| --- | --- | --- |
| `Prefer union type` (`no-restricted-syntax`) | An `enum` declaration | Use a union of string literals |
| `` Optional properties already include undefined; drop the union and prefer `?:`. `` (`no-restricted-syntax`) | `name?: string \| undefined` | Write `name?: string` |
| `` Use optional properties instead of unions with `undefined` (e.g. `email?: string`). `` (`no-restricted-syntax`) | `name: string \| undefined` | Write `name?: string` |
| `Only the HTTP method handlers (GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS) and generateStaticParams may be exported as functions from route.ts` (`no-restricted-syntax`, `nextjs`) | Another exported function in `app/api/**/route.*` | Move the helper to another module, or do not export it |
| `wrongFilename` (`convex-rules/standard-filenames`) | A Convex factory (`query`, `mutation`, `action` or an internal variant) exported from a file not named `queries.ts`, `mutations.ts`, `actions.ts`, `internal_mutations.ts` or `node_actions.ts` | Move it to the matching file |
| `wrongNamespace` (`convex-rules/namespace-separation`) | A factory of one kind in another kind's file, such as `query()` in `mutations.ts` | Move it to its own file |
| `notSnakeCase` (`convex-rules/snake-case-filenames`) | A file in `convex/` with hyphens or camelCase in its name | Rename it as the message suggests (`my-file.ts` to `my_file.ts`) |
| `noBareVAny` (`convex-rules/no-bare-v-any`) | `v.any()` outside `validators.ts` | Define a named alias in `validators.ts` and import it |
| `missingReturns` (`convex-rules/require-returns-validator`) | A Convex function without a `returns` validator | Add `returns: v.…` to the function config |
| `noQueryInLoop` (`convex-rules/no-query-in-loop`) | `ctx.db.query`, `ctx.db.get` or `ctx.runQuery` inside a loop | Batch the reads, for example one indexed query or `Promise.all` over the ids |
| `noFilterOnQuery` (`convex-rules/no-filter-on-query`) | `.filter()` on a database query | Add an index and use `.withIndex()` |
| `Parsing error: <file> was not found by the project service` | A linted `.ts` or `.tsx` file is not in any `tsconfig.json` | Add it to `include` in a `tsconfig.json`, or ignore it in your config |
| `SyntaxError: The requested module '@vllnt/eslint-config' does not provide an export named 'default'` | A default import from the root entry | Use a named import (`import { base } from "@vllnt/eslint-config"`) or a subpath default |
| `could not find plugin "@typescript-eslint"` | `playwright` (or another addition) used without a language preset | Spread a language preset first: `[...nextjs, ...playwright]` |
| `Cannot redefine plugin "<name>"` | Your config registers a different object for a plugin the preset already registers, such as a copy wrapped with `fixupPluginRules` | Register the same import as the preset, or drop your registration and only set rules |
| `[boundaries]: Please provide element types using the 'boundaries/elements' setting` | `boundaries` without element settings | Add `settings["boundaries/elements"]` ([example](#enforce-architecture-boundaries)) |
| `TypeError: context.getSourceCode is not a function` (`write-good-comments`) | `@vllnt/eslint-config` 2.1.x or older on ESLint 10 | Upgrade to 2.2.0 or later |

## Limits and gotchas

- Presets take no options, and every rule is `error`; there are no warnings. Change rules by appending config objects.
- Every linted `.ts` and `.tsx` file must be in a `tsconfig.json` (`projectService: true`). The `typescript` package must be the TypeScript 6.0 JavaScript API (`>=6.0.2 <6.1`).
- `turbo`, `boundaries`, `playwright` and `ignores` are additions, not language presets. `playwright` fails on its own; spread it after a language preset.
- `boundaries` enforces nothing until `settings["boundaries/elements"]` is set.
- In `react` and `nextjs`, `.tsx` and `*.decorator.ts` files check only function names, and `nodejs` does the same for `*.decorator.ts`; variables, types and properties there are not checked. `base` applies the full naming rule everywhere.
- Under Next.js `app/api/**/route.*`, the naming rule is off and the enum and `| undefined` bans do not apply.
- css-modules is registered but no rule is on.
- `convex-rules/snake-case-filenames` checks only files under `convex/`, not `src/component/`.
- The four gaps above stay as they are in version 2, because closing them would fail code that lints clean today; they are tracked for 3.0.0 in [#31](https://github.com/vllnt/eslint-config/issues/31).
- On ESLint 10, the rules of `eslint-plugin-write-good-comments`, `eslint-plugin-react` and `eslint-plugin-css-modules` run through `fixupRule` from `@eslint/compat`. The rules are replaced in place on the imported plugin object, so your own import of those plugins gets the same rules.

## Compatibility

| Package | Range | Notes |
| --- | --- | --- |
| `eslint` | `>=9` | Tested on 9 and 10; later majors are untested. On 10, `eslint-plugin-react` 7.37.5 and `eslint-plugin-jsx-a11y` 6.10.2 print a peer warning because their own ranges stop at 9 |
| `prettier` | `>=3` | Required |
| `typescript` | `>=6.0.2 <6.1` | The TypeScript 6 JavaScript API (`npm:@typescript/typescript6`). Needed by the root entry and `base`, `react`, `nextjs`, `nodejs` and `convex`; not by `turbo`, `boundaries`, `playwright` or `ignores` alone. TypeScript 5 is not supported |
| `@typescript/native` | `npm:typescript@^7.0.2` | Optional: the TypeScript 7 compiler for `tsc` |
| Node.js | `>=20` | CI runs Node 22 and 24. `@eslint/compat` declares `^20.19.0 \|\| ^22.13.0 \|\| >=24` |

Every plugin is a dependency of this package; do not install them separately. ESM only (`"type": "module"`), with TypeScript declarations for every entry point.

## Testing

This repository runs `pnpm test`: export and shape checks, real ESLint runs over fixtures on ESLint 9 and 10, the Convex rule tests, the packed-tarball contents check and a docs check of this README. Nothing to set up in your project.

## Security

Report vulnerabilities privately as described in the [security policy](https://github.com/vllnt/eslint-config/blob/main/SECURITY.md).

## Related packages

| Package | Use it for |
| --- | --- |
| [`@vllnt/typescript`](https://oss.vllnt.com/packages/typescript) | Shared `tsconfig` presets. Type-aware linting here reads your `tsconfig.json`; use that package to set the compiler options, this one to lint. |

## Contributing

See [CONTRIBUTING.md](https://github.com/vllnt/eslint-config/blob/main/CONTRIBUTING.md) and open [issues](https://github.com/vllnt/eslint-config/issues). The [LLM index](llms.txt) and the [changelog](CHANGELOG.md) ship with the package.

## License

[MIT](LICENSE)

Built by [bntvllnt](https://github.com/bntvllnt) · [bntvllnt.com](https://bntvllnt.com).
Part of [@vllnt](https://github.com/vllnt). [Sponsor the work](https://github.com/sponsors/bntvllnt).

---

Part of [vllnt open source](https://oss.vllnt.com) · [Package page](https://oss.vllnt.com/packages/eslint-config) · [vllnt.com](https://vllnt.com) · Built by [bntvllnt](https://bntvllnt.com)
