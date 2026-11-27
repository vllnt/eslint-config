import type { Linter } from "eslint";

/**
 * React preset: everything in `base` plus eslint-plugin-react, react-hooks and jsx-a11y, with overrides for `.tsx`, test files, `*.decorator.ts` naming and `unicorn/filename-case`.
 */
export declare const react: Linter.Config[];
export default react;
