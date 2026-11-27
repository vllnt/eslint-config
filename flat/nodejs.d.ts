import type { Linter } from "eslint";

/**
 * Node.js preset: everything in `base` plus overrides for test files, `*.decorator.ts` naming and `unicorn/filename-case` (off for `*.tsx`, `*.animations.ts`, `*.settings.ts`, `*.stories.ts` and `*.types.ts`).
 */
export declare const nodejs: Linter.Config[];
export default nodejs;
