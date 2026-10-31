import type { Linter } from "eslint";
import {
  base,
  boundaries,
  convex,
  nextjs,
  nodejs,
  react,
  turbo,
} from "@vllnt/eslint-config";
import boundariesDefault from "@vllnt/eslint-config/boundaries";
import convexDefault from "@vllnt/eslint-config/convex";
import nextjsDefault from "@vllnt/eslint-config/nextjs";
import nodejsDefault from "@vllnt/eslint-config/nodejs";
import reactDefault from "@vllnt/eslint-config/react";
import turboDefault from "@vllnt/eslint-config/turbo";

const config: Linter.Config[] = [
  ...base,
  ...boundaries,
  ...convex,
  ...nextjs,
  ...nodejs,
  ...react,
  ...turbo,
  ...boundariesDefault,
  ...convexDefault,
  ...nextjsDefault,
  ...nodejsDefault,
  ...reactDefault,
  ...turboDefault,
];

export default config;
