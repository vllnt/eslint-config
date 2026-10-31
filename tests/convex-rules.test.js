import { RuleTester } from "eslint";

import plugin from "../flat/convex-plugin.js";

const tester = new RuleTester();
const rules = plugin.rules;
const at = (file) => `/app/convex/${file}`;

const query = (body) => `export const a = query({ ${body} });`;

tester.run("standard-filenames", rules["standard-filenames"], {
  valid: [
    { code: query("returns: 1"), filename: at("queries.ts") },
    // Windows-style separators must behave like POSIX ones.
    { code: query("returns: 1"), filename: "C:\\app\\convex\\queries.ts" },
    { code: "export const a = 1;", filename: at("helpers.ts") },
    { code: "export function a() {}", filename: at("helpers.ts") },
  ],
  invalid: [
    {
      code: query("returns: 1"),
      filename: at("helpers.ts"),
      errors: [{ messageId: "wrongFilename" }],
    },
  ],
});

tester.run("namespace-separation", rules["namespace-separation"], {
  valid: [
    { code: query("returns: 1"), filename: at("queries.ts") },
    {
      code: "export const a = internalMutation({});",
      filename: at("internal_mutations.ts"),
    },
    { code: "export const a = action({});", filename: at("actions.ts") },
    { code: "export const a = other({});", filename: at("misc.ts") },
    { code: "export function a() {}", filename: at("misc.ts") },
  ],
  invalid: [
    {
      code: "export const a = mutation({});",
      filename: at("queries.ts"),
      errors: [{ messageId: "wrongNamespace" }],
    },
    {
      code: "export const a = internalAction({});",
      filename: at("mutations.ts"),
      errors: [{ messageId: "wrongNamespace" }],
    },
  ],
});

tester.run("snake-case-filenames", rules["snake-case-filenames"], {
  valid: [
    { code: "1;", filename: at("snake_case.ts") },
    { code: "1;", filename: "/app/src/Some-File.ts" },
    { code: "1;", filename: at("_generated/Bad-Name.ts") },
    { code: "1;", filename: at("styles.css") },
    { code: "1;", filename: at("PascalCase.ts") },
  ],
  invalid: [
    {
      code: "1;",
      filename: at("kebab-case.ts"),
      errors: [{ messageId: "notSnakeCase" }],
    },
    {
      code: "1;",
      filename: "C:\\app\\convex\\kebab-case.ts",
      errors: [{ messageId: "notSnakeCase" }],
    },
  ],
});

tester.run("no-bare-v-any", rules["no-bare-v-any"], {
  valid: [
    { code: "const a = v.any();", filename: at("validators.ts") },
    { code: "const a = v.any();", filename: at("queries.test.ts") },
    { code: "const a = v.string();", filename: at("queries.ts") },
    { code: "const a = v['any']();", filename: at("queries.ts") },
  ],
  invalid: [
    {
      code: "const a = v.any();",
      filename: at("queries.ts"),
      errors: [{ messageId: "noBareVAny" }],
    },
  ],
});

tester.run("require-returns-validator", rules["require-returns-validator"], {
  valid: [
    { code: query("returns: 1") },
    { code: query("'returns': 1") },
    { code: "const a = query();" },
    { code: "const a = query(config);" },
    { code: "const a = other({});" },
  ],
  invalid: [
    {
      code: query("args: {}"),
      errors: [{ messageId: "missingReturns" }],
    },
    {
      code: query("...rest"),
      errors: [{ messageId: "missingReturns" }],
    },
  ],
});

tester.run("no-query-in-loop", rules["no-query-in-loop"], {
  valid: [
    { code: "for (const x of await ctx.db.query('t').take(5)) { use(x); }" },
    { code: "await Promise.all(ids.map((id) => ctx.db.get(id)));" },
    { code: "for (const id of ids) { run(() => ctx.db.get(id)); }" },
    { code: "ctx.db.insert('t', {});" },
    { code: "ctx['runQuery'](q);" },
  ],
  invalid: [
    {
      code: "for (const id of ids) { await ctx.db.get(id); }",
      errors: [{ messageId: "noQueryInLoop" }],
    },
    {
      code: "while (go) { await ctx.runQuery(q); }",
      errors: [{ messageId: "noQueryInLoop" }],
    },
    {
      code: "for (;;) ctx.db.query('t');",
      errors: [{ messageId: "noQueryInLoop" }],
    },
  ],
});

tester.run("no-filter-on-query", rules["no-filter-on-query"], {
  valid: [
    { code: "rows.filter((r) => r.x);" },
    { code: "(await ctx.db.query('t').collect()).filter((r) => r.x);" },
    { code: "ctx.db.query('t').withIndex('i');" },
    { code: "a['filter'](ctx.db.query);" },
  ],
  invalid: [
    {
      code: "ctx.db.query('t').filter((q) => q.eq(1, 1));",
      errors: [{ messageId: "noFilterOnQuery" }],
    },
    {
      code: "ctx.db.query('t').withIndex('i').filter((q) => q);",
      errors: [{ messageId: "noFilterOnQuery" }],
    },
  ],
});
