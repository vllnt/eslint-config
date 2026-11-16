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
const MAX_LINES = "max-lines-per-function";

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

describe("playwright: relaxes only what Playwright idioms need", () => {
  const E2E_PASS = [
    "pass/tests/e2e/viewports.spec.ts",
    "pass/tests/e2e/auth.setup.ts",
    "pass/e2e/smoke.spec.ts",
    "pass/playwright.config.ts",
    "pass/mts/playwright.config.mts",
  ];
  const PATTERNS = [
    "pass/tests/**/*.ts",
    "pass/e2e/*.ts",
    "pass/*.ts",
    "pass/mts/*.mts",
    "fail/tests/**/*.ts",
    "fail/app/helpers/*.ts",
  ];
  let withNextjs;
  let withBase;
  let control;
  before(async () => {
    withNextjs = await lintFixtures(["nextjs", "playwright"], PATTERNS);
    withBase = await lintFixtures(["base", "playwright"], PATTERNS);
    control = await lintFixtures(["nextjs"], PATTERNS);
  });

  for (const file of E2E_PASS) {
    it(`${file} lints clean after nextjs`, () => {
      assertClean(withNextjs, file);
    });
    it(`${file} lints clean after base`, () => {
      assertClean(withBase, file);
    });
  }

  it("control: without the preset the same files fail on exactly the relaxed rules", () => {
    assertRules(control, "pass/tests/e2e/viewports.spec.ts", [LOOPS, NAMING]);
    assertRules(control, "pass/tests/e2e/auth.setup.ts", [MAX_LINES]);
    assertRules(control, "pass/e2e/smoke.spec.ts", [LOOPS]);
    assertRules(control, "pass/playwright.config.ts", [LOOPS]);
    assertRules(control, "pass/mts/playwright.config.mts", [LOOPS]);
  });

  it("still errors on a loop in a non-test file under app/", () => {
    assertRules(withNextjs, "fail/app/helpers/loop.ts", [LOOPS]);
  });

  it("still errors on a loop in an e2e helper that is not a spec or setup file", () => {
    assertRules(withNextjs, "fail/tests/e2e/helper.ts", [LOOPS]);
  });

  it("still errors on a long function in an e2e helper", () => {
    assertRules(withNextjs, "fail/tests/e2e/long-helper.ts", [MAX_LINES]);
  });

  it("does not relax write-good-comments", () => {
    assertRules(withNextjs, "fail/tests/e2e/comment.spec.ts", [
      "write-good-comments/write-good-comments",
    ]);
  });

  it("does not relax unicorn/prevent-abbreviations", () => {
    assertRules(withNextjs, "fail/tests/e2e/abbreviation.spec.ts", [
      "unicorn/prevent-abbreviations",
    ]);
  });

  it("still checks variable names (only object keys are relaxed)", () => {
    assertRules(withNextjs, "fail/tests/e2e/snake-variable.spec.ts", [NAMING]);
  });
});
