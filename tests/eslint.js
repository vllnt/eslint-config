// The ESLint under test: the `eslint` devDependency (9) by default, or the
// `eslint10` alias when LINT_ESLINT=eslint10, so the suite proves both majors.
const name = process.env.LINT_ESLINT ?? "eslint";

export const { ESLint, RuleTester } = await import(name);
export const { builtinRules } = await import(`${name}/use-at-your-own-risk`);
