import type { Linter } from "eslint";

/**
 * Architecture boundaries addition: eslint-plugin-boundaries recommended rules. Enforces nothing until you set `settings["boundaries/elements"]`.
 */
export declare const boundaries: Linter.Config[];
export default boundaries;
