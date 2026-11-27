import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import convexRules from "../flat/convex-plugin.js";
import * as presets from "../flat/index.js";
import { ESLint } from "./eslint.js";

// Keeps README.md, llms.txt, package.json and the TSDoc of every export in the
// shape coding agents rely on: the same sections in every @vllnt README, every
// export and every reported message documented, and examples that really run.

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NAME = "eslint-config";
const PKG = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const README = readFileSync(join(ROOT, "README.md"), "utf8");
const LLMS = readFileSync(join(ROOT, "llms.txt"), "utf8");
const LINES = README.split("\n");

const SECTIONS = [
  "For coding agents",
  "When to use",
  "Install",
  "Quick start",
  "API",
  "Common tasks",
  "Errors and fixes",
  "Limits and gotchas",
  "Compatibility",
  "Testing",
  "Security",
  "Related packages",
  "Contributing",
  "License",
];

const FOOTER = [
  "---",
  "",
  `Part of [vllnt open source](https://oss.vllnt.com) · [Package page](https://oss.vllnt.com/packages/${NAME}) · [vllnt.com](https://vllnt.com) · Built by [bntvllnt](https://bntvllnt.com)`,
];

const ECOSYSTEM = `## Ecosystem

- [Package page](https://oss.vllnt.com/packages/${NAME})
- [All @vllnt packages](https://oss.vllnt.com/llms.txt)
- [vllnt](https://vllnt.com/llms.txt)
- [Author](https://bntvllnt.com)
`;

// Built from parts so this file does not contain the banned domain itself.
const BANNED_DOMAIN = ["vllnt", "ai"].join(".");

function section(markdown, title) {
  const start = markdown.indexOf(`\n## ${title}\n`);
  assert.ok(start !== -1, `missing section ${title}`);
  const end = markdown.indexOf("\n## ", start + 1);
  return markdown.slice(start, end === -1 ? undefined : end);
}

function codeBlocks(markdown) {
  return [...markdown.matchAll(/^```([^\n]*)\n([\s\S]*?)^```$/gm)].map(
    ([, lang, body]) => ({ lang: lang.trim(), body }),
  );
}

// GitHub's heading anchors: lower case, punctuation dropped, spaces to hyphens.
function slug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\w\- ]/g, "")
    .replaceAll(" ", "-");
}

function anchors(markdown) {
  return new Set(
    [...markdown.matchAll(/^#{1,6} (.+)$/gm)].map(([, text]) => slug(text)),
  );
}

function packedFiles() {
  const out = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
  return JSON.parse(out)[0].files.map(({ path }) => path);
}

describe("docs: package.json metadata", () => {
  it("description is one sentence of at most 160 characters", () => {
    assert.ok(PKG.description.length <= 160, `${PKG.description.length} characters`);
    assert.match(PKG.description, /^[^.]+(\.[^\s.][^.]*)*\.$/);
    assert.doesNotMatch(PKG.description, /vllnt projects/i);
  });

  it("has 8 to 12 unique keywords", () => {
    assert.ok(PKG.keywords.length >= 8 && PKG.keywords.length <= 12, `${PKG.keywords.length}`);
    assert.equal(new Set(PKG.keywords).size, PKG.keywords.length);
  });

  it("homepage, author, funding and bugs point at the right pages", () => {
    assert.equal(PKG.homepage, `https://oss.vllnt.com/packages/${NAME}`);
    assert.deepEqual(PKG.author, { name: "bntvllnt", url: "https://bntvllnt.com" });
    assert.deepEqual(PKG.funding, { type: "github", url: "https://github.com/sponsors/bntvllnt" });
    assert.deepEqual(PKG.bugs, { url: `https://github.com/vllnt/${NAME}/issues` });
  });
});

describe("docs: README structure", () => {
  it("starts with the package name and one sentence", () => {
    assert.equal(LINES[0], `# ${PKG.name}`);
    assert.equal(LINES[1], "");
    assert.match(LINES[2], /^[^\n]+\.$/);
    assert.equal(LINES[3], "");
  });

  it("has the shared sections, in order", () => {
    const found = [...README.matchAll(/^## (.+)$/gm)].map(([, title]) => title);
    assert.deepEqual(found, SECTIONS);
  });

  it("keeps the coding-agent note to 3 lines", () => {
    const body = section(README, "For coding agents").split("\n").slice(2).filter(Boolean);
    assert.ok(body.length <= 3, `${body.length} lines`);
  });

  it("lists 2 to 4 reasons to use it and 1 to 3 reasons not to", () => {
    const body = section(README, "When to use");
    const [use, avoid] = body.split("Do not use it when:");
    const bullets = (text) => text.split("\n").filter((line) => line.startsWith("- ")).length;
    assert.ok(body.includes("Use it when:"));
    assert.ok(bullets(use) >= 2 && bullets(use) <= 4, `use: ${bullets(use)}`);
    assert.ok(bullets(avoid) >= 1 && bullets(avoid) <= 3, `avoid: ${bullets(avoid)}`);
  });

  it("has the install command and a working example in the first 40 lines", () => {
    const install = LINES.findIndex((line) => line.startsWith(`pnpm add -D ${PKG.name}`));
    const example = LINES.findIndex((line) => line.startsWith("```js"));
    const exampleEnd = LINES.findIndex((line, index) => index > example && line === "```");
    assert.ok(install !== -1 && install < 40, `install on line ${install + 1}`);
    assert.ok(example !== -1 && exampleEnd < 40, `example ends on line ${exampleEnd + 1}`);
  });

  it("ends with the shared footer", () => {
    assert.deepEqual(LINES.slice(-4), [...FOOTER, ""]);
  });

  it("links each related @vllnt package to its package page", () => {
    const links = [...section(README, "Related packages").matchAll(/\[`?@vllnt\/([\w-]+)`?\]\(([^)]+)\)/g)];
    assert.ok(links.length > 0);
    for (const [, other, url] of links) {
      assert.equal(url, `https://oss.vllnt.com/packages/${other}`);
    }
  });
});

describe("docs: code blocks", () => {
  const blocks = [...codeBlocks(README), ...codeBlocks(LLMS)];

  it("every code block has a language tag", () => {
    assert.deepEqual(blocks.filter(({ lang }) => !lang).map(({ body }) => body.slice(0, 40)), []);
  });

  it("no code block has an elided gap", () => {
    // `...name` and `...[` are spreads; any other `...` or `…` stands for left-out code.
    const gaps = blocks.filter(({ body }) => /\.\.\.(?![\w$[({])|…/.test(body));
    assert.deepEqual(gaps.map(({ body }) => body.slice(0, 60)), []);
  });

  it("every js block imports what it uses from the package", () => {
    for (const { body } of blocks.filter(({ lang }) => lang === "js")) {
      assert.match(body, new RegExp(`^import .+ from "${PKG.name}(/[\\w-]+)?";$`, "m"), body);
    }
  });

  describe("every js example loads in ESLint against the package exports", () => {
    // Inside the package directory, `@vllnt/eslint-config` resolves through
    // the package's own `exports` map, as it does for a consumer.
    const dir = join(ROOT, "tests", ".docs-examples");
    after(() => rmSync(dir, { recursive: true, force: true }));
    blocks
      .filter(({ lang }) => lang === "js")
      .forEach(({ body }, index) => {
        it(`example ${index + 1}: ${body.split("\n").find((line) => line.startsWith("export"))}`, async () => {
          mkdirSync(dir, { recursive: true });
          const file = join(dir, `example-${index + 1}.mjs`);
          writeFileSync(file, body);
          const { default: config } = await import(pathToFileURL(file).href);
          assert.ok(Array.isArray(config) && config.length > 0);
          const eslint = new ESLint({ cwd: ROOT, overrideConfigFile: true, overrideConfig: config });
          const resolved = await eslint.calculateConfigForFile(join(ROOT, "src", "index.ts"));
          assert.ok(Object.keys(resolved.rules ?? {}).length > 0);
        });
      });
  });
});

describe("docs: API and errors are complete", () => {
  const api = section(README, "API");
  const errors = section(README, "Errors and fixes");

  it("documents every export of every entry point", () => {
    const missing = [];
    for (const name of Object.keys(presets)) {
      if (!api.includes(`\`${name}\``)) missing.push(name);
    }
    for (const subpath of Object.keys(PKG.exports)) {
      if (subpath === "." || subpath === "./package.json") continue;
      if (!api.includes(`"${PKG.name}/${subpath.slice(2)}"`)) missing.push(subpath);
    }
    assert.deepEqual(missing, []);
  });

  it("links every API row to a reference heading", () => {
    const headings = anchors(README);
    const targets = [...api.matchAll(/\(#([\w-]+)\)/g)].map(([, anchor]) => anchor);
    assert.ok(targets.length >= Object.keys(presets).length);
    assert.deepEqual(targets.filter((anchor) => !headings.has(anchor)), []);
  });

  it("documents every message a preset or a convex-rules rule reports", () => {
    const messages = new Set();
    for (const config of Object.values(presets).flat()) {
      for (const value of Object.values(config.rules ?? {})) {
        for (const option of Array.isArray(value) ? value : []) {
          if (option?.message) messages.add(option.message);
        }
      }
    }
    const missing = [...messages].filter((message) => !errors.includes(message));
    for (const [rule, { meta }] of Object.entries(convexRules.rules)) {
      for (const messageId of Object.keys(meta.messages)) {
        if (!errors.includes(`\`${messageId}\` (\`convex-rules/${rule}\`)`)) {
          missing.push(`${rule}: ${messageId}`);
        }
      }
    }
    assert.ok(messages.size > 0);
    assert.deepEqual(missing, []);
  });
});

describe("docs: links and shipped files", () => {
  const files = packedFiles();

  for (const [doc, text] of [["README.md", README], ["llms.txt", LLMS]]) {
    it(`${doc}: every relative link resolves inside the package`, () => {
      const broken = [];
      for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        if (/^(https?:|mailto:)/.test(target)) continue;
        const [path, anchor] = target.split("#");
        const file = path ? resolve(ROOT, path).slice(ROOT.length + 1) : doc;
        if (!files.includes(file) || !existsSync(join(ROOT, file))) {
          broken.push(target);
          continue;
        }
        if (anchor && file.endsWith(".md") && !anchors(readFileSync(join(ROOT, file), "utf8")).has(anchor)) {
          broken.push(target);
        }
      }
      assert.deepEqual(broken, []);
    });
  }

  it("llms.txt ends with the Ecosystem block and names the oss index once", () => {
    assert.ok(LLMS.endsWith(ECOSYSTEM), "llms.txt must end with the Ecosystem block");
    assert.equal(LLMS.split("https://oss.vllnt.com/llms.txt").length - 1, 1);
  });

  it(`no shipped or tracked file mentions ${BANNED_DOMAIN}`, () => {
    const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .filter(Boolean);
    const hits = [...new Set([...files, ...tracked])].filter((file) => {
      const path = join(ROOT, file);
      return existsSync(path) && readFileSync(path, "utf8").includes(BANNED_DOMAIN);
    });
    assert.deepEqual(hits, []);
  });
});

describe("docs: TSDoc on every public export", () => {
  for (const name of Object.keys(presets)) {
    for (const extension of ["js", "d.ts"]) {
      it(`flat/${name}.${extension} documents \`${name}\``, () => {
        const source = readFileSync(join(ROOT, "flat", `${name}.${extension}`), "utf8");
        const declaration = extension === "js" ? `export const ${name} =` : `export declare const ${name}:`;
        assert.match(source, new RegExp(`\\*/\\n${declaration.replaceAll(" ", "\\s")}`));
      });
    }
  }

  for (const file of ["flat/index.js", "flat/index.d.ts"]) {
    it(`${file} links the package page`, () => {
      const source = readFileSync(join(ROOT, file), "utf8");
      assert.ok(source.startsWith("/**"));
      assert.ok(source.includes(` * @see https://oss.vllnt.com/packages/${NAME}\n`));
    });
  }
});
