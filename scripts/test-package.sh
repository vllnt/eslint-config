#!/usr/bin/env bash
#
# test-package.sh — install the packed tarball into a clean consumer project and
# prove that every package.json export loads, lints and type-checks there: once
# on ESLint 9 (the `eslint` devDependency) and once on ESLint 10 (the `eslint10`
# alias). The checks themselves live in scripts/test-package-consumer.mjs.
#
# Usage: bash scripts/test-package.sh
#
# Exit codes: 0 every entry point passed, 1 any step or entry point failed.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# A dependency spec as this repository declares it: devDependencies first, then
# peerDependencies (prettier is only a peer here).
spec() {
  node -e '
    const pkg = require(process.argv[1]);
    const spec = pkg.devDependencies?.[process.argv[2]] ?? pkg.peerDependencies?.[process.argv[2]];
    if (!spec) process.exit(1);
    console.log(spec);
  ' "$ROOT/package.json" "$1" || { echo "FAIL  package.json declares no $1" >&2; exit 1; }
}

ESLINT9="$(spec eslint)"
ESLINT10="$(spec eslint10)"
PRETTIER="$(spec prettier)"
TYPESCRIPT="$(spec typescript)"
NATIVE="$(spec @typescript/native)"
RELEASE_AGE="$(node -p 'require(process.argv[1]).pnpm?.minimumReleaseAge ?? 0' "$ROOT/package.json")"

(cd "$ROOT" && pnpm pack --pack-destination "$WORK" > "$WORK/pack.log" 2>&1) \
  || { echo "FAIL  pnpm pack"; cat "$WORK/pack.log"; exit 1; }
TARBALL="$(find "$WORK" -maxdepth 1 -name '*.tgz' -print -quit)"
[[ -n "$TARBALL" ]] || { echo "FAIL  pnpm pack produced no tarball"; exit 1; }

# One consumer at a time: install, check, delete.
consumer_check() {
  local label="$1" eslint="$2" consumer="$WORK/consumer"
  rm -rf "$consumer"
  mkdir "$consumer"
  printf '{ "name": "consumer", "private": true, "type": "module" }\n' > "$consumer/package.json"
  # The TypeScript specs are the ones the README Install section uses.
  if ! (cd "$consumer" && pnpm add -D --config.minimum-release-age="$RELEASE_AGE" \
    "$TARBALL" "eslint@$eslint" "prettier@$PRETTIER" \
    "typescript@$TYPESCRIPT" "@typescript/native@$NATIVE") > "$WORK/install.log" 2>&1; then
    echo "FAIL  $label: pnpm add of the packed tarball failed"
    tail -n 30 "$WORK/install.log"
    rm -rf "$consumer"
    return 1
  fi
  cp "$ROOT/scripts/test-package-consumer.mjs" "$consumer/check.mjs"
  local code=0
  (cd "$consumer" && node check.mjs) || code=$?
  rm -rf "$consumer"
  return "$code"
}

failed=0
consumer_check "ESLint 9" "$ESLINT9" || failed=1
consumer_check "ESLint 10" "$ESLINT10" || failed=1

if [[ "$failed" -ne 0 ]]; then
  echo "FAIL  test-package.sh: the packed tarball failed in a consumer project"
  exit 1
fi
echo "OK    test-package.sh"
