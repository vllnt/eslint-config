import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";

// These tests run real ESLint over the files in tests/fixtures/lint. Each new
// behaviour has a fixture that must lint clean and a near-miss that differs in
// one respect and must still fail with exactly the expected rule.

const LINT_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "lint",
);

const NAMING = "@typescript-eslint/naming-convention";
const RESTRICTED = "no-restricted-syntax";
const LOOPS = "functional/no-loop-statements";

async function compose(...names) {
  const parts = [];
  for (const name of names) {
    parts.push(...(await import(`../flat/${name}.js`))[name]);
  }
  return parts;
}

async function lintFixtures(names, patterns) {
  const eslint = new ESLint({
    cwd: LINT_DIR,
    overrideConfigFile: true,
    overrideConfig: await compose(...names),
  });
  const results = await eslint.lintFiles(patterns);
  return new Map(
    results.map((r) => [relative(LINT_DIR, r.filePath), r.messages]),
  );
}

const describeMessage = ({ message, ruleId }) => `${ruleId}: ${message}`;

function messagesFor(results, file) {
  const messages = results.get(file);
  assert.ok(messages, `${file} was not linted`);
  return messages;
}

function assertClean(results, file) {
  assert.deepEqual(
    messagesFor(results, file).map(describeMessage),
    [],
    `${file} should lint clean`,
  );
}

function assertRules(results, file, expected) {
  const messages = messagesFor(results, file);
  assert.deepEqual(
    [...new Set(messages.map(({ ruleId }) => ruleId ?? "fatal"))].sort(),
    [...expected].sort(),
    `${file}: ${messages.map(describeMessage).join("; ")}`,
  );
}

describe("nextjs: route handlers accept Next.js conventions narrowly", () => {
  let results;
  before(async () => {
    results = await lintFixtures(
      ["nextjs"],
      ["pass/app/**/*.ts", "fail/app/**/route.ts", "fail/app/not-a-route/*.ts"],
    );
  });

  it("app/api route: every HTTP method, config exports, generateStaticParams, quoted headers", () => {
    assertClean(results, "pass/app/api/items/route.ts");
  });

  it("route outside app/api: GET and quoted header keys", () => {
    assertClean(results, "pass/app/robots.txt/route.ts");
  });

  it("rejects an uppercase export that is not an HTTP method (FETCH)", () => {
    assertRules(results, "fail/app/fetch-export/route.ts", [NAMING]);
  });

  it("rejects a method name in the wrong case (Get)", () => {
    assertRules(results, "fail/app/get-pascal/route.ts", [NAMING]);
  });

  it("accepts the method name only when it is exported", () => {
    assertRules(results, "fail/app/internal-get/route.ts", [NAMING]);
  });

  it("accepts the method name only in a route file", () => {
    assertRules(results, "fail/app/not-a-route/handlers.ts", [NAMING]);
  });

  it("app/api route: FETCH fails the naming rule and the export allowlist", () => {
    assertRules(results, "fail/app/api/fetch-export/route.ts", [
      NAMING,
      RESTRICTED,
    ]);
  });

  it("app/api route: a lowercase get export fails the export allowlist", () => {
    assertRules(results, "fail/app/api/lowercase-get/route.ts", [RESTRICTED]);
  });

  it("keeps functional/no-loop-statements on for route handlers", () => {
    assertRules(results, "fail/app/loops/route.ts", [LOOPS]);
  });
});

describe("base: keys that require quotes are accepted, other keys are not", () => {
  for (const preset of ["base", "nextjs"]) {
    it(`${preset}: content-type, x-default and @type pass; user_id fails`, async () => {
      const results = await lintFixtures(
        [preset],
        ["pass/lib/*.ts", "fail/lib/*.ts"],
      );
      assertClean(results, "pass/lib/quoted-keys.ts");
      assertRules(results, "fail/lib/snake-key.ts", [NAMING]);
    });
  }
});
