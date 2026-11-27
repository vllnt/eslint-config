// The ESLint under test: the `eslint` devDependency (9) by default, or the
// `eslint10` alias when LINT_ESLINT=eslint10, so the suite proves both majors.
// Plugins that import `eslint` themselves (for example typescript-eslint's
// extension rules) still resolve the 9 devDependency here; installing the packed
// tarball next to `eslint@10` is the check for ESLint 10's own copies.
const name = process.env.LINT_ESLINT ?? "eslint";

export const { ESLint, RuleTester } = await import(name);
export const { builtinRules } = await import(`${name}/use-at-your-own-risk`);
