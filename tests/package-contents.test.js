import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The docs coding agents read from node_modules/@vllnt/eslint-config/.
const REQUIRED = ["package.json", "README.md", "LICENSE", "CHANGELOG.md", "llms.txt"];

// Contributor and repository files that must stay out of the tarball.
const FORBIDDEN = [/^AGENTS\.md$/, /^CLAUDE\.md$/, /^\.claude\//, /^tests\//, /^scripts\//, /^\.github\//, /^CONTRIBUTING\.md$/];

function packedFiles() {
  const out = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  return JSON.parse(out)[0].files.map(({ path }) => path);
}

describe("package contents: npm tarball", () => {
  const files = packedFiles();

  it("ships the docs agents read", () => {
    const missing = REQUIRED.filter((file) => !files.includes(file));
    assert.deepEqual(missing, [], `missing from the tarball: ${missing.join(", ")}`);
  });

  it("ships every package.json exports target", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    const targets = Object.values(pkg.exports).map((target) => target.replace(/^\.\//, ""));
    const missing = targets.filter((file) => !files.includes(file));
    assert.deepEqual(missing, [], `exports targets missing: ${missing.join(", ")}`);
  });

  it("leaves contributor files, tests and scripts out", () => {
    const leaked = files.filter((file) => FORBIDDEN.some((re) => re.test(file)));
    assert.deepEqual(leaked, [], `should not ship: ${leaked.join(", ")}`);
  });

  it("every relative link in llms.txt resolves inside the tarball", () => {
    const llms = readFileSync(join(ROOT, "llms.txt"), "utf8");
    const links = [...llms.matchAll(/\]\(([^)\s]+)\)/g)].map(([, href]) => href);
    const relative = links.filter((href) => !/^[a-z]+:/i.test(href));
    assert.ok(relative.length > 0, "llms.txt has no relative links");
    const broken = relative.filter((href) => {
      const file = href.replace(/^\.\//, "").split("#")[0];
      return !files.includes(file);
    });
    assert.deepEqual(broken, [], `llms.txt links outside the tarball: ${broken.join(", ")}`);
  });
});
