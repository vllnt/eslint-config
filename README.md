# @vllnt/eslint-config

ESLint flat config presets for TypeScript, React, Next.js, Node.js, Convex, Turborepo and Playwright, with type-aware rules and Prettier, all at error.

## For coding agents

The docs ship inside the package, in `node_modules/@vllnt/eslint-config/`: `README.md`, `llms.txt` and `CHANGELOG.md`.
They match the installed version. Read them before writing or changing an ESLint config that uses this package.
Every export is listed under [API](#api); every message this package defines (its `no-restricted-syntax` messages and the bundled `convex-rules`) is under [Errors and fixes](#errors-and-fixes).

## When to use

Use it when:

- You lint a TypeScript project with ESLint 9 or 10 flat config (`eslint.config.js`) and want type-aware `typescript-eslint` rules, Prettier formatting and import sorting reported as errors.
- The project is React, Next.js (App Router), Node.js or Convex, optionally with Turborepo, Playwright e2e tests or architecture boundaries.
- You want one dev dependency that brings every plugin; you do not install the plugins yourself.

Do not use it when:

- You need warnings, per-preset options or a looser rule set: presets take no options and every rule is `error`. Compose `typescript-eslint` configs and the plugins directly.
- The project uses `.eslintrc` (ESLint 8 or older): this package is flat config only. Use the configs each plugin publishes for ESLint 8.
- Type-aware linting must run on TypeScript 5, or on TypeScript 7 installed as `typescript`: the declared `typescript` peer range is `>=6.0.2 <6.1`, and versions outside it are untested. Use `typescript-eslint` configs that match your TypeScript version.

## Install

```sh
pnpm add -D @vllnt/eslint-config@^2 @typescript/native@npm:typescript@^7.0.2 eslint@^10 prettier typescript@npm:@typescript/typescript6@^6.0.2
```

`tsc` runs TypeScript 7 (`@typescript/native`), while type-aware linting imports the TypeScript 6 JavaScript API through the `typescript` package. ESLint 9 works too (`eslint@^9`). Stable releases use the npm `latest` tag; `@canary` is a moving prerelease.

## Quick start

```js
// eslint.config.js
import { nextjs } from "@vllnt/eslint-config/nextjs";

export default [{ ignores: ["eslint.config.js"] }, ...nextjs];
```

Run `pnpm exec eslint .` in a project whose `tsconfig.json` includes its source files. The presets turn on `projectService` (type-aware linting) for every file ESLint lints, `.js` config files included, so every linted file must be in a `tsconfig.json` or ignored. Without the `ignores` entry, `eslint .` fails with `Parsing error: .../eslint.config.js was not found by the project service`. Ignore other `.js` config files (`prettier.config.js`, `next.config.js`) the same way, or include them in a `tsconfig.json` with `allowJs`.

## API

Every entry point exports an array of flat config objects. Spread it into your config. The root entry has named exports only; each subpath also has a default export. `./package.json` is exported for tooling.

| Export | Import | What it is |
| --- | --- | --- |
| `base` | `import { base } from "@vllnt/eslint-config"` | TypeScript strict and stylistic type-checked rules, Prettier, import sorting, Unicorn, functional rules and comment checks ([base preset](#base-preset)) |
| `react` | `import { react } from "@vllnt/eslint-config/react"` | `base` plus React, React Hooks and jsx-a11y ([react preset](#react-preset)) |
| `nextjs` | `import { nextjs } from "@vllnt/eslint-config/nextjs"` | `react` plus the Next.js plugin, route handler names and build output ignores ([nextjs preset](#nextjs-preset)) |
| `nodejs` | `import { nodejs } from "@vllnt/eslint-config/nodejs"` | `base` plus test-file, `*.decorator.ts` and file-name overrides ([nodejs preset](#nodejs-preset)) |
| `convex` | `import { convex } from "@vllnt/eslint-config/convex"` | 4 `@convex-dev` rules and 7 `convex-rules` rules for `convex/` and `src/component/` ([convex preset](#convex-preset)) |
| `turbo` | `import { turbo } from "@vllnt/eslint-config/turbo"` | Turborepo cache rules; an addition to a language preset ([turbo addition](#turbo-addition)) |
| `boundaries` | `import { boundaries } from "@vllnt/eslint-config/boundaries"` | Architecture boundaries rules; needs `settings["boundaries/elements"]` and `boundaries/element-types` options ([boundaries addition](#boundaries-addition)) |
| `playwright` | `import { playwright } from "@vllnt/eslint-config/playwright"` | Overlay for Playwright spec, setup and config files ([playwright overlay](#playwright-overlay)) |
| `ignores` | `import { ignores } from "@vllnt/eslint-config/ignores"` | Shared ignores for build and test output ([ignores list](#ignores-list)) |

Every name above is also a named export of the root entry `@vllnt/eslint-config`.

### base preset

Also included by `react`, `nextjs` and `nodejs`. It has no file-specific overrides: every rule below applies to every linted file.

| Plugin | What it does |
| --- | --- |
| [@eslint/js](https://eslint.org/docs/latest/rules/) | ESLint recommended rules (from `@eslint/js` 9 on both ESLint majors) |
| [typescript-eslint](https://typescript-eslint.io/) | `strictTypeChecked` + `stylisticTypeChecked`, with `projectService: true` |
| [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) | Prettier as ESLint errors, with your Prettier config |
| [eslint-plugin-perfectionist](https://perfectionist.dev/) | Natural sort of objects, object types, interfaces, unions, enums, JSX props, named exports, Map entries and `includes` arrays |
| [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) | A curated list of Unicorn rules (not `recommended`) |
| [eslint-plugin-simple-import-sort](https://github.com/lydell/eslint-plugin-simple-import-sort) | Import and export ordering |
| [eslint-plugin-functional](https://github.com/eslint-functional/eslint-plugin-functional) | No loop statements, readonly types, no `arguments` |
| [eslint-plugin-write-good-comments](https://github.com/kantord/eslint-plugin-write-good-comments) | Comment wording |

Rules it sets on top of those configs:

- Naming (`@typescript-eslint/naming-convention`): camelCase by default; variables camelCase or UPPER_CASE; imports camelCase or PascalCase; types PascalCase without an `I` or `T` prefix; type parameters PascalCase with a `T` prefix; enum members camelCase or UPPER_CASE; leading and trailing underscores allowed. Object keys that start with `/`, and object and type property names that need quotes (`'content-type'`, `'@type'`), are exempt; names that do not need quotes (`user_id`) are still checked.
- `no-restricted-syntax`: no `enum`, and no `| undefined` unions on properties.
- typescript-eslint: `consistent-type-definitions` (`type`), `consistent-type-imports` (inline `type` imports), `array-type`, `consistent-indexed-object-style`, `consistent-generic-constructors`, `prefer-readonly`, `switch-exhaustiveness-check`, `no-explicit-any`, `no-import-type-side-effects`, `dot-notation`, `prefer-optional-chain`, `no-unnecessary-type-assertion`, `require-await`, `no-unused-vars` (arguments starting with `_` and rest siblings allowed; other unused names starting with `_` are reported) and `ban-ts-comment` (`@ts-ignore` allowed with a description).
- Off, although the typescript-eslint configs turn them on: `unbound-method`, `prefer-nullish-coalescing`, `no-unsafe-assignment`, `no-unsafe-class-instance-assignment`, `no-extraneous-class`, `no-base-to-string` and `no-unnecessary-condition`. `explicit-function-return-type` and `explicit-module-boundary-types` are off too.
- Size: `max-params` 3, `max-lines-per-function` 30 (blank lines and comments not counted), `max-depth` 3.
- Also on: `prefer-const`, `no-param-reassign`, `no-unreachable-loop`, `no-async-promise-executor`, `no-console` (except `console.debug`, `console.error`, `console.info` and `console.warn`), `functional/no-loop-statements`, `functional/functional-parameters` (rest parameters allowed, `arguments` not) and `functional/readonly-type` (`readonly` keyword).
- Unicorn includes `filename-case` (kebab-case), `no-null`, `no-nested-ternary`, `prefer-module`, `prefer-top-level-await`, `switch-case-braces` (`avoid`) and `prevent-abbreviations`, which allows `ctx`, `db`, `e`, `fn`, `props`, `ref` and `utils`. Unicorn rules not in `flat/core/unicorn.js` are off.
- Import groups (`simple-import-sort/imports`): side-effect imports, then `react` and `node:`, then packages, then `@/`, `../` and `./`. `sort-imports` and `no-duplicate-imports` are off.

### react preset

Everything in `base`, plus:

| Plugin | What it does |
| --- | --- |
| [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) | Recommended + jsx-runtime, plus 24 more rules; `react/prop-types` off; React version detected |
| [eslint-plugin-react-hooks](https://react.dev/reference/rules/rules-of-hooks) | `recommended-latest` at `error`: Rules of Hooks, exhaustive deps, React Compiler rules |
| [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) | Recommended accessibility rules; `label-has-associated-control` accepts nesting or `htmlFor`, at depth 3 |
| [eslint-plugin-css-modules](https://github.com/atfzl/eslint-plugin-css-modules) | Registered only: `no-unused-class` is off and no other rule is on |

These apply to every linted file. `@typescript-eslint/restrict-template-expressions` is set to `{ allowNumber: true }`, which replaces the strict options from `base`, so the rule falls back to its own defaults: `any`, `boolean`, nullish (`null`, `undefined`), `number` and `RegExp` values are allowed in template literals, and `base` reports each of them. Overrides by file:

- `*.tsx`: `max-lines-per-function` is 70; `unicorn/no-null`, `unicorn/no-nested-ternary`, `@typescript-eslint/no-misused-promises` and `@typescript-eslint/require-await` are off; the naming rule checks only function names (camelCase or PascalCase).
- `*.tsx`, `*.animations.ts`, `*.settings.ts`, `*.stories.ts` and `*.types.ts`: `unicorn/filename-case` is off.
- `*.test.ts`, `*.spec.ts` and `*.e2e.ts`: `max-lines-per-function` and `@typescript-eslint/no-unsafe-member-access` are off.
- `*.decorator.ts`: the naming rule checks only function names (camelCase or PascalCase).

See [Limits and gotchas](#limits-and-gotchas) for what the naming overrides leave unchecked.

### nextjs preset

Everything in `react`, with the same file overrides, plus [@next/eslint-plugin-next](https://nextjs.org/docs/app/api-reference/config/eslint) recommended and core web vitals rules, all at `error`.

- Route handlers (`app/**/route.{js,jsx,ts}`) may export `GET`, `HEAD`, `POST`, `PUT`, `PATCH`, `DELETE` and `OPTIONS` as functions. Any other name keeps the base naming rule, so `FETCH`, `Get`, a non-exported `GET`, or `GET` outside a route file still fail. `route.tsx` follows the `.tsx` rule, which accepts PascalCase functions, so `GET` passes there.
- Under `app/api/**/route.*`, the naming rule is off, and `no-restricted-syntax` only limits function exports to those methods and `generateStaticParams`.
- `functional/no-loop-statements` stays on in route handlers.
- Ignored: `.next/` and `next-env.d.ts` at any depth, and `out/` and `build/` at the config root.
- `max-lines-per-function` is off in `app/**/page.*` and `app/**/layout.*`.

### nodejs preset

Everything in `base`, plus these file overrides (`react` and `nextjs` have them too):

- `*.test.ts`, `*.spec.ts` and `*.e2e.ts`: `max-lines-per-function` and `@typescript-eslint/no-unsafe-member-access` are off.
- `*.decorator.ts`: the naming rule checks only function names (camelCase or PascalCase).
- `*.tsx`, `*.animations.ts`, `*.settings.ts`, `*.stories.ts` and `*.types.ts`: `unicorn/filename-case` is off.

### convex preset

| Rule | Catches |
| --- | --- |
| `@convex-dev/no-old-registered-function-syntax` | A Convex function registered as a bare function instead of the object syntax (`query({ args, handler })`) |
| `@convex-dev/require-args-validator` | A Convex function without an `args` validator |
| `@convex-dev/explicit-table-ids` | `db.get`, `db.replace`, `db.patch` or `db.delete` called without the table name as the first argument (`ctx.db.get(id)` instead of `ctx.db.get("users", id)`) |
| `@convex-dev/import-wrong-runtime` | A Convex function file importing a relative `"use node"` module; version 5.0.1 also reports it when the importing file is itself `"use node"` |
| `convex-rules/standard-filenames` | Factories outside `queries.ts`, `mutations.ts`, `actions.ts`, `internal_mutations.ts`, `node_actions.ts` |
| `convex-rules/namespace-separation` | `query()` in `mutations.ts`, `mutation()` in `queries.ts` |
| `convex-rules/snake-case-filenames` | Non-`snake_case` `.ts` filenames in `convex/` (hyphens, camelCase); names starting uppercase are exempt |
| `convex-rules/no-bare-v-any` | `v.any()` outside `validators.ts` |
| `convex-rules/require-returns-validator` | Missing `returns` validator in a factory config |
| `convex-rules/no-query-in-loop` | `ctx.db.query`, `ctx.db.get` or `ctx.runQuery` inside a loop |
| `convex-rules/no-filter-on-query` | `.filter()` on a query chain (use `.withIndex()`) |

`@typescript-eslint/explicit-module-boundary-types` is also on for Convex sources. The preset sets the typescript-eslint parser with `projectService: true` for those files and adds no other rules, so use it alone or after a language preset.

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

### turbo addition

[eslint-plugin-turbo](https://turborepo.dev/docs/reference/eslint-plugin-turbo) recommended rules (`turbo/no-undeclared-env-vars`). Spread it after a language preset.

### boundaries addition

[eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) 5.4.0 recommended config: `boundaries/element-types`, `boundaries/entry-point`, `boundaries/external` and `boundaries/no-private` (with `allowUncles`) at `error`; `no-ignored`, `no-unknown` and `no-unknown-files` off; `boundaries/elements` empty.

- Nothing is reported until you set `settings["boundaries/elements"]`.
- With elements set, only `no-private` checks anything. `element-types`, `entry-point` and `external` report nothing until you give them rule options, such as the `element-types` rules in [Enforce architecture boundaries](#enforce-architecture-boundaries).
- Imports are resolved with `eslint-import-resolver-node`, which tries `.mjs`, `.js`, `.json` and `.node` by default. An import it cannot resolve is not checked, so set `settings["import/resolver"]` to add `.ts` and `.tsx`, as the example does. No TypeScript resolver is bundled: path aliases (`@/…`) and `.js` specifiers that point at `.ts` files need one, such as `eslint-import-resolver-typescript`, installed and configured in your project.

### playwright overlay

An overlay: spread it after a language preset, which registers the plugins and rules it adjusts. It applies to `**/tests/e2e/**/*.{spec,setup}.ts`, `**/e2e/**/*.spec.ts` and `**/playwright.config.{ts,mts}`.

| Rule | Change | Why |
| --- | --- | --- |
| `functional/no-loop-statements` | off | Tests and projects are generated per viewport, locale or route |
| `max-lines-per-function` | off | A `describe` block or setup step covers a whole page or sign-in flow |
| `@typescript-eslint/naming-convention` | object literal keys unchecked | Expected-data tables use the page's labels and the API's field names as keys |

Everything else stays on, including `write-good-comments` and `unicorn/prevent-abbreviations`. Helpers in `tests/e2e/` that are not `*.spec.ts` or `*.setup.ts` keep every rule.

### ignores list

Ignores `coverage/`, `playwright-report/`, `test-results/`, `.turbo/` and `.worktrees/` at any depth, and `dist/` and `build/` at the config root, so a source folder with one of those names deeper in the tree is still linted. ESLint already ignores `node_modules/` and `.git/`; `nextjs` adds its own output.

## Common tasks

### Combine presets

```js
import { ignores } from "@vllnt/eslint-config/ignores";
import { nextjs } from "@vllnt/eslint-config/nextjs";
import { playwright } from "@vllnt/eslint-config/playwright";
import { turbo } from "@vllnt/eslint-config/turbo";

export default [
  { ignores: ["eslint.config.js"] },
  ...ignores,
  ...nextjs,
  ...turbo,
  ...playwright,
];
```

### Change a rule

Presets take no options. Append a config object; later objects win.

```js
import { nodejs } from "@vllnt/eslint-config/nodejs";

export default [
  { ignores: ["eslint.config.js"] },
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
  { ignores: ["eslint.config.js"] },
  ...base,
  ...convex,
  {
    files: ["convex/**/*.ts"],
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          extendDefaultReplacements: true,
          ignore: [
            "e2e",
            "a11y",
            "i18n",
            "getInitialProps",
            "generateStaticParams",
            "dynamicParams",
            ".*Ctx$",
            ".*Ref$",
          ],
          replacements: {
            args: false,
            ctx: false,
            db: false,
            e: false,
            fn: false,
            props: false,
            ref: false,
            utils: false,
          },
        },
      ],
    },
  },
  {
    files: ["convex/**/node_actions.ts"],
    rules: { "@convex-dev/import-wrong-runtime": "off" },
  },
];
```

`base` (and every language preset) applies `unicorn/filename-case`, which wants kebab-case, to Convex files too, so the snake_case names the layout above expects (`node_actions.ts`, `internal_mutations.ts`) fail it; the first object turns it off under `convex/`, where `convex-rules/snake-case-filenames` checks names instead.

The same object allows `args`, the parameter name in Convex's usual `handler: async (ctx, args)`. Without it, `unicorn/prevent-abbreviations` reports ``The variable `args` should be named `arguments_`. A more descriptive name will do too``. ESLint replaces a rule's options instead of merging them, so the object repeats the options `base` sets (`flat/core/unicorn.js`) and adds `args: false`; `{ replacements: { args: false } }` alone makes `ctx` fail again (``The variable `ctx` should be named `context` ``).

The second object is optional. `@convex-dev/import-wrong-runtime` 5.0.1 reports every relative import of a `"use node"` module from a Convex function file, without checking whether the importing file is itself `"use node"`. A `node_actions.ts` file that starts with `"use node"` and imports a `"use node"` helper is reported although both run in Node.js; the override turns the rule off for those files only.

### Enforce architecture boundaries

```js
import { boundaries } from "@vllnt/eslint-config/boundaries";
import { nodejs } from "@vllnt/eslint-config/nodejs";

export default [
  { ignores: ["eslint.config.js"] },
  ...nodejs,
  ...boundaries,
  {
    rules: {
      "boundaries/element-types": [
        "error",
        { default: "disallow", rules: [{ allow: ["shared"], from: "feature" }] },
      ],
    },
    settings: {
      "boundaries/elements": [
        { pattern: "src/features/*", type: "feature" },
        { pattern: "src/shared/*", type: "shared" },
      ],
      "import/resolver": { node: { extensions: [".ts", ".tsx", ".js"] } },
    },
  },
];
```

With this config, `src/features/cart/index.ts` importing `../billing` (another feature) fails with `boundaries/element-types`: `No rule allowing this dependency was found. File is of type 'feature'. Dependency is of type 'feature'`. Importing `../../shared/money` passes. Without the `import/resolver` setting, the extensionless imports are not resolved and nothing is reported.

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

Every message this package defines: the `no-restricted-syntax` messages in the presets and the messages of the bundled `convex-rules` rules (shown with placeholders as `<name>`). Then errors from common setup mistakes. Messages of the bundled plugins (typescript-eslint, Unicorn, React, `@convex-dev` and others) are documented by each plugin.

| Message or code | Cause | Fix |
| --- | --- | --- |
| `Prefer union type` (`no-restricted-syntax`) | An `enum` declaration | Use a union of string literals |
| `` Optional properties already include undefined; drop the union and prefer `?:`. `` (`no-restricted-syntax`) | `name?: string \| undefined` | Write `name?: string` |
| `` Use optional properties instead of unions with `undefined` (e.g. `email?: string`). `` (`no-restricted-syntax`) | `name: string \| undefined` | Write `name?: string` |
| `Only the HTTP method handlers (GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS) and generateStaticParams may be exported as functions from route.ts` (`no-restricted-syntax`, `nextjs`) | Another exported function in `app/api/**/route.*` | Move the helper to another module, or do not export it |
| `wrongFilename` (`convex-rules/standard-filenames`): `Convex <factoryType>() exports must be in a standard-named file (queries.ts, mutations.ts, actions.ts, internal_mutations.ts, or node_actions.ts). Found in "<filename>".` | A Convex factory (`query`, `mutation`, `action` or an internal variant) exported from a file with another name | Move it to the matching file |
| `wrongNamespace` (`convex-rules/namespace-separation`): `<factoryType>() exports must be in <expectedFile>, not "<actualFile>". Move this function to the correct file.` | A factory of one kind in another kind's file, such as `query()` in `mutations.ts` | Move it to its own file |
| `notSnakeCase` (`convex-rules/snake-case-filenames`): `File "<filename>" must use snake_case naming in convex/. Rename to "<suggested>".` | A `.ts` file in `convex/` whose name is not `snake_case` | Rename it to `snake_case` yourself (`myFile.ts` to `my_file.ts`). The suggested name only replaces hyphens, so for `myFile.ts` it suggests `myFile.ts` |
| `noBareVAny` (`convex-rules/no-bare-v-any`): `Bare v.any() is not allowed. Define a named alias in a validators.ts file instead.` | `v.any()` outside `validators.ts` | Define a named alias in `validators.ts` and import it |
| `missingReturns` (`convex-rules/require-returns-validator`): `` Convex <factoryType>() must have a `returns` validator. Add `returns: v.null()` or the appropriate validator. `` | A Convex function without a `returns` validator | Add a `returns` validator to the function config |
| `noQueryInLoop` (`convex-rules/no-query-in-loop`): `Database query/get inside a loop creates N+1 performance issues. Use Promise.all() with .map() for batch fetching.` | `ctx.db.query`, `ctx.db.get` or `ctx.runQuery` inside a loop | Batch the reads, for example one indexed query or `Promise.all` over the ids |
| `noFilterOnQuery` (`convex-rules/no-filter-on-query`): `Don't use .filter() on Convex queries — it causes full table scans. Use .withIndex() instead.` | `.filter()` on a database query | Add an index and use `.withIndex()` |
| `Parsing error: <file> was not found by the project service` | A linted file, `.js` config files such as `eslint.config.js` included, is not in any `tsconfig.json` | Ignore it in your config (`{ ignores: ["eslint.config.js"] }`), or add it to `include` in a `tsconfig.json` (`allowJs` for `.js` files) |
| `SyntaxError: The requested module '@vllnt/eslint-config' does not provide an export named 'default'` | A default import from the root entry | Use a named import (`import { base } from "@vllnt/eslint-config"`) or a subpath default |
| `A configuration object specifies rule "@typescript-eslint/naming-convention", but could not find plugin "@typescript-eslint".` (the `eslint` CLI; the Node.js API throws `Key "rules": Key "@typescript-eslint/naming-convention": Could not find plugin "@typescript-eslint" in configuration.`) | `playwright` used without a language preset; `turbo`, `boundaries`, `ignores` and `convex` load on their own | Spread a language preset first: `[...nextjs, ...playwright]` |
| `Cannot redefine plugin "<name>"` | Your config registers a different object for a plugin the preset already registers, such as a copy wrapped with `fixupPluginRules` | Register the same import as the preset, or drop your registration and only set rules |
| `` Pages directory cannot be found at <root>/pages or <root>/src/pages. If using a custom path, please configure with the `no-html-link-for-pages` rule in your eslint config file. `` (printed warning from `@next/next/no-html-link-for-pages`, not a lint error) | `nextjs` run from a directory (`<root>`, the working directory by default) that has none of `pages/`, `src/pages/`, `app/` and `src/app/`, such as a monorepo root whose app lives in `apps/web/` | Point the Next.js plugin at the app: `{ settings: { next: { rootDir: "apps/web/" } } }` after the preset |
| `[boundaries]: Please provide element types using the 'boundaries/elements' setting` (printed warning, not a lint error) | `boundaries` without element settings | Add `settings["boundaries/elements"]` ([Enforce architecture boundaries](#enforce-architecture-boundaries)) |
| `TypeError: context.getSourceCode is not a function` (`write-good-comments`) | `@vllnt/eslint-config` 2.1.x or older on ESLint 10 | Upgrade to 2.2.0 or later |
| `contextOrFilename.getFilename is not a function` (`eslint-plugin-react`, for example `Error while loading rule 'react/display-name'`) | `@vllnt/eslint-config` 2.1.x or older on ESLint 10, with `react` or `nextjs` | Upgrade to 2.2.0 or later |

## Limits and gotchas

- Presets take no options, and every rule is `error`; there are no warnings. Change rules by appending config objects.
- Every file ESLint lints must be in a `tsconfig.json` or ignored (`projectService: true` applies to every file, `.js` config files included). The declared `typescript` peer range is `>=6.0.2 <6.1` (the TypeScript 6.0 JavaScript API); TypeScript 5 is outside it and untested.
- `@convex-dev/eslint-plugin` 5.0.1 depends on `typescript@^5.9.2`, and the `typescript` peer is optional, so a missing TypeScript 6 install does not warn. With a hoisted `node_modules` (npm, or pnpm with `node-linker=hoisted`), that TypeScript 5.9 can sit at `node_modules/typescript`, and type-aware linting then runs on it without an error. Install the `typescript` alias from [Install](#install).
- `turbo`, `boundaries`, `playwright` and `ignores` are additions, not language presets. Only `playwright` fails on its own; spread it after a language preset.
- `boundaries` reports nothing until `settings["boundaries/elements"]` is set, and then only `no-private` runs until `element-types`, `entry-point` or `external` get options. It bundles no TypeScript import resolver, so imports it cannot resolve are not checked.
- In `react` and `nextjs`, `.tsx` and `*.decorator.ts` files check only function names, and `nodejs` does the same for `*.decorator.ts`; variables, types and properties there are not checked. `base` applies the full naming rule everywhere.
- Under Next.js `app/api/**/route.*`, the naming rule is off and the enum and `| undefined` bans do not apply.
- css-modules is registered but no rule is on.
- `convex-rules/snake-case-filenames` checks only files under `convex/`, not `src/component/`.
- The four gaps above stay as they are in version 2, because closing them would fail code that lints clean today; they are tracked for 3.0.0 in [#31](https://github.com/vllnt/eslint-config/issues/31).
- `unicorn/prevent-abbreviations` (from every language preset) reports the `args` parameter of Convex's usual `handler: async (ctx, args)`. Allow it under `convex/`, as in [Lint a Convex backend](#lint-a-convex-backend); the override must repeat the base options, because ESLint replaces rule options instead of merging them.
- `unicorn/filename-case` (kebab-case, from every language preset) and `convex-rules/snake-case-filenames` disagree: `node_actions.ts` and `internal_mutations.ts` fail the first. Turn `unicorn/filename-case` off under `convex/`, as in [Lint a Convex backend](#lint-a-convex-backend).
- On every ESLint version, the rules of `eslint-plugin-write-good-comments`, `eslint-plugin-react` and `eslint-plugin-css-modules` run through `fixupRule` from `@eslint/compat`, which adds back the context methods ESLint 10 removed. The rules are replaced in place on the imported plugin object, so your own import of those plugins gets the same rules.

## Compatibility

| Package | Range | Notes |
| --- | --- | --- |
| `eslint` | `>=9` | Tested on 9 and 10; later majors are untested. On 10, `eslint-plugin-react` 7.37.5 and `eslint-plugin-jsx-a11y` 6.10.2 print a peer warning because their own ranges stop at 9 |
| `prettier` | `>=3` | Required |
| `typescript` | `>=6.0.2 <6.1` | The TypeScript 6 JavaScript API (`npm:@typescript/typescript6`). Loaded when you import the root entry or `base`, `react`, `nextjs`, `nodejs` or `convex`; not when you import only `turbo`, `boundaries`, `playwright` or `ignores`. TypeScript 5 is outside this range and untested; see [Limits and gotchas](#limits-and-gotchas) for how 5.9 can load anyway |
| `@typescript/native` | `npm:typescript@^7.0.2` | Optional: the TypeScript 7 compiler for `tsc`. The install prints a third peer warning: `@typescript-eslint/typescript-estree` 8.73.0 declares an optional `@typescript/native` peer of `npm:typescript@>=7.1.0-dev.20261009.1 \|\| >=7.1.0-beta <7.1.0-dev`. It is harmless: typescript-estree loads `@typescript/native` only for its experimental `tsgo` backend (`TYPESCRIPT_ESLINT_EXPERIMENTAL_BACKEND=tsgo` or `projectService.EXPERIMENTAL_backend`), which the presets do not turn on |
| Node.js | `>=20` | CI runs Node 22 and 24. `@eslint/compat` declares `^20.19.0 \|\| ^22.13.0 \|\| >=24` |

Every plugin is a dependency of this package; do not install them separately. ESM only (`"type": "module"`), with TypeScript declarations for every entry point.

## Testing

This repository runs `pnpm test`: export and shape checks, real ESLint runs over fixtures on ESLint 9 and 10, the Convex rule tests, the packed-tarball contents check, a type check of the test files and a docs check of this README, which lints a sample project with every JavaScript example. On every pull request and before every publish, `pnpm test:package` installs the packed tarball in a clean project and lints and type-checks every entry point on ESLint 9 and 10. Nothing to set up in your project.

## Security

Report vulnerabilities privately as described in the [security policy](https://github.com/vllnt/eslint-config/blob/main/SECURITY.md).

## Related packages

None: this package has no `@vllnt` dependency, and no test or example here uses another `@vllnt` package.

## Contributing

See [CONTRIBUTING.md](https://github.com/vllnt/eslint-config/blob/main/CONTRIBUTING.md) and open [issues](https://github.com/vllnt/eslint-config/issues). The [LLM index](llms.txt) and the [changelog](CHANGELOG.md) ship with the package.

## Links

- Docs and changelog: [oss.vllnt.com/packages/eslint-config](https://oss.vllnt.com/packages/eslint-config) · [release feed](https://oss.vllnt.com/packages/eslint-config/rss.xml)
- All @vllnt packages: [oss.vllnt.com](https://oss.vllnt.com) · [search packages and docs on index.vllnt.com](https://index.vllnt.com)
- Source and issues: [GitHub](https://github.com/vllnt/eslint-config) · [issues](https://github.com/vllnt/eslint-config/issues) · [npm](https://www.npmjs.com/package/@vllnt/eslint-config)
- Questions and updates: [Discord](https://bntvllnt.com/discord) · [X @bntvllnt](https://x.com/bntvllnt)
- Company and author: [vllnt.com](https://vllnt.com) · [bntvllnt.com](https://bntvllnt.com) · [GitHub @bntvllnt](https://github.com/bntvllnt) · [LinkedIn](https://linkedin.com/in/bntvllnt)
- Sponsor: [GitHub Sponsors](https://github.com/sponsors/bntvllnt)

## License

[MIT](LICENSE)

Built by [bntvllnt](https://github.com/bntvllnt) · [bntvllnt.com](https://bntvllnt.com).

---

Part of [vllnt open source](https://oss.vllnt.com) · [Package page](https://oss.vllnt.com/packages/eslint-config) · [vllnt.com](https://vllnt.com) · Built by [bntvllnt](https://bntvllnt.com)
