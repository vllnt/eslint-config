import type { Linter } from "eslint";

/**
 * Architecture boundaries addition: eslint-plugin-boundaries 5.4.0 recommended rules. Reports nothing until you set `settings["boundaries/elements"]`; then only `no-private` runs until `element-types`, `entry-point` or `external` get rule options. No TypeScript import resolver is bundled, so set `settings["import/resolver"]` to resolve `.ts` imports.
 */
export declare const boundaries: Linter.Config[];
export default boundaries;
