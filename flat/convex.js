/**
 * Convex ESLint config. Can be used standalone or composed with base.
 *
 * @example
 * import { base } from '@vllnt/eslint-config'
 * import { convex } from '@vllnt/eslint-config/convex'
 * export default [...base, ...convex]
 */
import convexPlugin from '@convex-dev/eslint-plugin'
import unicornPlugin from 'eslint-plugin-unicorn'

export const convex = [
  {
    plugins: {
      '@convex-dev': convexPlugin,
      unicorn: unicornPlugin,
    },
  },
  {
    files: ['**/convex/**/*.ts'],
    rules: {
      '@convex-dev/import-wrong-runtime': 'off',
      '@convex-dev/no-old-registered-function-syntax': 'error',
      '@convex-dev/require-args-validator': 'error',
      'unicorn/filename-case': ['error', { cases: { snakeCase: true } }],
    },
  },
]

export default convex
