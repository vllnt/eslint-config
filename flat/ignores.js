// Generated and tool-owned output that is never worth linting, shared so each
// repo stops copying (and drifting from) the same list. Tool-specific names
// match at any depth; generic names (`dist`, `build`) match only at the config
// root so a source folder with that name deeper in the tree stays linted.
// ESLint already ignores `**/node_modules/` and `.git/`. The Next.js preset
// adds `.next`, `out` and `next-env.d.ts` itself.
export const ignores = [
  {
    ignores: [
      '**/.turbo/**',
      '**/.worktrees/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      'build/**',
      'dist/**',
    ],
  },
]

export default ignores
