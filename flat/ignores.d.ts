import type { Linter } from "eslint";

/**
 * Shared ignores for tool output: `coverage/`, `playwright-report/`, `test-results/`, `.turbo/` and `.worktrees/` at any depth, and `dist/` and `build/` at the config root.
 */
export declare const ignores: Linter.Config[];
export default ignores;
