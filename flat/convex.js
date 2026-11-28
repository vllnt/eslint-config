/**
 * Convex ESLint config — strict backend best practices.
 *
 * Includes: 4 @convex-dev official rules, 7 custom convex-rules
 * (structure, naming, query optimization, type safety), and
 * explicit-module-boundary-types for Convex functions.
 *
 * With base or another language preset, use the config in "Lint a Convex
 * backend" in the README (it ignores eslint.config.js and adjusts Unicorn
 * rules for Convex file and parameter names).
 *
 * @example Standalone
 * import { convex } from '@vllnt/eslint-config/convex'
 * export default [...convex]
 */
import tseslint from "typescript-eslint";
import convexPlugin from "@convex-dev/eslint-plugin";
import convexRulesPlugin from "./convex-plugin.js";

const CONVEX_SOURCE = ["**/convex/**/*.ts", "**/src/component/**/*.ts"];
const CONVEX_EXCLUDED = [
  "**/convex/_generated/**",
  "**/convex/**/*.test.ts",
  "**/convex/testing/**",
  "**/src/component/_generated/**",
  "**/src/component/**/*.test.ts",
  "**/src/component/testing/**",
];

/**
 * Convex preset: 4 @convex-dev rules and 7 `convex-rules` rules for `convex/` and `src/component/` sources. It adds no base rules: use it alone or after a language preset.
 */
export const convex = [
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@convex-dev": convexPlugin,
      "convex-rules": convexRulesPlugin,
    },
  },

  // ── Core rules: all convex source files ───────────────────────────────
  {
    files: CONVEX_SOURCE,
    ignores: CONVEX_EXCLUDED,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      // Official @convex-dev plugin rules retained from version 1.
      "@convex-dev/no-old-registered-function-syntax": "error",
      "@convex-dev/require-args-validator": "error",
      "@convex-dev/explicit-table-ids": "error",
      "@convex-dev/import-wrong-runtime": "error",

      // Structure
      "convex-rules/standard-filenames": "error",
      "convex-rules/namespace-separation": "error",
      "convex-rules/snake-case-filenames": "error",

      // Type safety
      "convex-rules/no-bare-v-any": "error",
      "convex-rules/require-returns-validator": "error",

      // Query optimization
      "convex-rules/no-query-in-loop": "error",
      "convex-rules/no-filter-on-query": "error",

      // Explicit return types on Convex functions
      "@typescript-eslint/explicit-module-boundary-types": "error",
    },
  },

  // ── Override: config files (exempt from snake_case + boundary types) ──
  {
    files: [
      "**/convex/auth.ts",
      "**/convex/auth.config.ts",
      "**/convex/convex.config.ts",
      "**/src/component/auth.ts",
      "**/src/component/auth.config.ts",
      "**/src/component/convex.config.ts",
    ],
    rules: {
      "convex-rules/snake-case-filenames": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },

  // ── Override: migration files (relaxed structure rules) ───────────────
  {
    files: ["**/convex/migrations/**", "**/src/component/migrations/**"],
    rules: {
      "convex-rules/standard-filenames": "off",
      "convex-rules/namespace-separation": "off",
      "convex-rules/no-query-in-loop": "off",
    },
  },
];

export default convex;
