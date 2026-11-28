// @ts-check
// Runs inside the clean consumer project that scripts/test-package.sh creates,
// so every import resolves the installed tarball and the consumer's own ESLint
// and TypeScript, never this repository's sources. For each package.json export
// it writes an eslint.config.js composed as the README says, lints a clean
// sample (0 errors) and a failing one (the expected rule reports), then
// type-checks a strict consumer that imports every export.
//
// Usage (from the consumer directory): node check.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import { ESLint } from "eslint";

const PACKAGE = "@vllnt/eslint-config";
const LABEL = `ESLint ${ESLint.version}`;
const CONSUMER = process.cwd();

/** @type {{ exports: Record<string, string> }} */
const manifest = JSON.parse(readFileSync(join("node_modules", PACKAGE, "package.json"), "utf8"));

const entries = Object.keys(manifest.exports)
  .filter((subpath) => subpath !== "./package.json")
  .map((subpath) => {
    const name = subpath === "." ? "base" : subpath.slice(2);
    return { name, specifier: subpath === "." ? PACKAGE : `${PACKAGE}/${name}` };
  });

// Language presets lint TypeScript on their own. Additions, overlays and
// `convex` are spread after `base`, and `ignores` before it, as in the README.
const STANDALONE = new Set(["base", "nextjs", "nodejs", "react"]);

const CLEAN = "export const sum = (left: number, right: number): number => left + right;\n";
const ANY = "export const value: any = 1;\n";
const LOOP = `export const total = (values: readonly number[]): number => {
  let sum = 0;
  for (const value of values) {
    sum += value;
  }
  return sum;
};
`;

/** @typedef {{ clean?: Record<string, string>, fail?: Record<string, string>, rule?: string }} Samples */

/** @type {Required<Samples>} */
const DEFAULT_SAMPLES = {
  clean: { "src/index.ts": CLEAN },
  fail: { "fail/any.ts": ANY },
  rule: "@typescript-eslint/no-explicit-any",
};

// Samples that only pass or fail when the entry itself is applied.
/** @type {Record<string, Samples>} */
const SAMPLES = {
  convex: {
    clean: { "convex/schema.ts": CLEAN },
    fail: { "fail/convex/badName.ts": CLEAN },
    rule: "convex-rules/snake-case-filenames",
  },
  ignores: { clean: { "coverage/any.ts": ANY } },
  playwright: { clean: { "tests/e2e/loop.spec.ts": LOOP } },
  turbo: { fail: { "fail/env.ts": "export const mode = process.env.MODE;\n" }, rule: "turbo/no-undeclared-env-vars" },
};

const TSCONFIG = { compilerOptions: { noEmit: true, skipLibCheck: true, strict: true }, include: ["**/*.ts"] };

/** @param {string} path @param {string} text */
function write(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

/** @param {{ name: string, specifier: string }} entry */
function configSource({ name, specifier }) {
  const lines = [`import { ${name} } from "${specifier}";`];
  let spread = `...${name}`;
  if (!STANDALONE.has(name)) {
    lines.unshift(`import { base } from "${PACKAGE}";`);
    spread = name === "ignores" ? "...ignores, ...base" : `...base, ...${name}`;
  }
  return `${lines.join("\n")}\n\nexport default [{ ignores: ["eslint.config.js"] }, ${spread}];\n`;
}

/** @param {string} dir @param {ESLint.LintResult[]} results */
function errors(dir, results) {
  return results.flatMap(({ filePath, messages }) =>
    messages
      .filter(({ severity }) => severity === 2)
      .map(({ message, ruleId }) => ({ file: relative(dir, filePath), message, ruleId: ruleId ?? "fatal" })),
  );
}

/** @param {{ name: string, specifier: string }} entry */
async function checkEntry(entry) {
  /** @type {Record<string, unknown>} */
  const module_ = await import(entry.specifier);
  const preset = module_[entry.name];
  if (!Array.isArray(preset) || preset.length === 0) throw new Error(`named export "${entry.name}" is not a non-empty array`);
  if (entry.specifier !== PACKAGE && module_.default !== preset) throw new Error(`default export is not "${entry.name}"`);

  const samples = { ...DEFAULT_SAMPLES, ...SAMPLES[entry.name] };
  const clean = { ...DEFAULT_SAMPLES.clean, ...SAMPLES[entry.name]?.clean };
  const dir = join(CONSUMER, "projects", entry.name);
  write(join(dir, "eslint.config.js"), configSource(entry));
  write(join(dir, "tsconfig.json"), `${JSON.stringify(TSCONFIG, undefined, 2)}\n`);
  for (const [file, text] of Object.entries({ ...clean, ...samples.fail })) write(join(dir, file), text);

  const cleanResults = await new ESLint({ cwd: dir, ignorePatterns: ["fail/"] }).lintFiles(["."]);
  const cleanErrors = errors(dir, cleanResults);
  if (cleanErrors.length > 0) {
    throw new Error(`clean sample has ${cleanErrors.length} error(s): ${cleanErrors.map((e) => `${e.file}: ${e.ruleId}: ${e.message}`).join("; ")}`);
  }
  if (!cleanResults.some(({ filePath }) => filePath === join(dir, "src", "index.ts"))) throw new Error("src/index.ts was not linted");

  const failErrors = errors(dir, await new ESLint({ cwd: dir }).lintFiles(["fail"]));
  if (!failErrors.some(({ ruleId }) => ruleId === samples.rule)) {
    const found = failErrors.map((e) => `${e.file}: ${e.ruleId}`).join("; ") || "no errors";
    throw new Error(`failing sample did not report ${samples.rule} (${found})`);
  }
}

function typeSource() {
  const lines = ['import type { Linter } from "eslint";', `import { ${entries.map(({ name }) => name).join(", ")} } from "${PACKAGE}";`];
  const spreads = entries.map(({ name }) => `...${name}`);
  for (const { name, specifier } of entries) {
    if (specifier === PACKAGE) continue;
    lines.push(`import ${name}Default, { ${name} as ${name}Named } from "${specifier}";`);
    spreads.push(`...${name}Default`, `...${name}Named`);
  }
  return `${lines.join("\n")}\n\nexport const configs: Linter.Config[] = [\n  ${spreads.join(",\n  ")},\n];\n`;
}

let failed = 0;
for (const entry of entries) {
  try {
    await checkEntry(entry);
    console.log(`ok    ${LABEL} ${entry.specifier}`);
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message : String(error);
    // Print installed paths from the package name on, not the store path.
    const short = message.split("\n")[0].replaceAll(/\/\S*?\/node_modules\/(?=@vllnt\/eslint-config\/)/g, "");
    console.log(`FAIL  ${LABEL} ${entry.specifier}: ${short.replaceAll(`${CONSUMER}/`, "")}`);
  }
}

write("types.mts", typeSource());
const typesConfig = {
  compilerOptions: { module: "nodenext", moduleResolution: "nodenext", noEmit: true, strict: true, target: "es2022", types: [] },
  include: ["types.mts"],
};
write("tsconfig.json", `${JSON.stringify(typesConfig, undefined, 2)}\n`);
const tsc = join("node_modules", ".bin", "tsc");
try {
  const version = execFileSync(tsc, ["--version"], { encoding: "utf8" }).trim();
  execFileSync(tsc, ["-p", "tsconfig.json"], { encoding: "utf8", stdio: "pipe" });
  console.log(`ok    ${LABEL} tsc ${version} --noEmit (strict, nodenext) importing ${entries.length} entry points`);
} catch (error) {
  failed += 1;
  const output = /** @type {{ stdout?: string }} */ (error).stdout ?? String(error);
  console.log(`FAIL  ${LABEL} tsc --noEmit:\n${output.trim()}`);
}

if (failed > 0) {
  console.log(`FAIL  ${LABEL}: ${failed} check(s) failed`);
  process.exitCode = 1;
}
