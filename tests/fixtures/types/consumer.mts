import type { Linter } from "eslint";
import {
  base,
  boundaries,
  convex,
  ignores,
  nextjs,
  nodejs,
  playwright,
  react,
  turbo,
} from "@vllnt/eslint-config";
import boundariesDefault from "@vllnt/eslint-config/boundaries";
import convexDefault from "@vllnt/eslint-config/convex";
import nextjsDefault from "@vllnt/eslint-config/nextjs";
import ignoresDefault from "@vllnt/eslint-config/ignores";
import nodejsDefault from "@vllnt/eslint-config/nodejs";
import playwrightDefault from "@vllnt/eslint-config/playwright";
import reactDefault from "@vllnt/eslint-config/react";
import turboDefault from "@vllnt/eslint-config/turbo";

const config: Linter.Config[] = [
  ...base,
  ...boundaries,
  ...convex,
  ...ignores,
  ...nextjs,
  ...nodejs,
  ...playwright,
  ...react,
  ...turbo,
  ...boundariesDefault,
  ...convexDefault,
  ...ignoresDefault,
  ...nextjsDefault,
  ...nodejsDefault,
  ...playwrightDefault,
  ...reactDefault,
  ...turboDefault,
];

export default config;
