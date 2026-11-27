import type { Linter } from "eslint";

/**
 * Next.js preset: everything in `react` plus @next/eslint-plugin-next (recommended and core web vitals at `error`), App Router route handler names and Next.js build output ignores.
 */
export declare const nextjs: Linter.Config[];
export default nextjs;
