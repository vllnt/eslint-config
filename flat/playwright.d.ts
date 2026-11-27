import type { Linter } from "eslint";

/**
 * Playwright overlay for e2e spec, setup and config files: turns off loop and function-length limits and object-key naming there. Spread it after a language preset.
 */
export declare const playwright: Linter.Config[];
export default playwright;
