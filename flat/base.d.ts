import type { Linter } from "eslint";

/**
 * Base preset: ESLint recommended, typescript-eslint `strictTypeChecked` and `stylisticTypeChecked` with type-aware linting, Prettier, import sorting, Unicorn, functional rules and comment checks, every rule at `error`.
 */
export declare const base: Linter.Config[];
