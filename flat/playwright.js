import { namingConvention } from './core/typescript.js'

// An opt-in addition for Playwright files, like Turbo and Boundaries: spread it
// after a language preset (`base`, `nextjs`, ...), which registers the plugins
// and rules these overrides adjust. Every rule it does not name stays as the
// language preset sets it, including `write-good-comments` and
// `unicorn/prevent-abbreviations`.
/**
 * Playwright overlay for e2e spec, setup and config files: turns off loop and function-length limits and object-key naming there. Spread it after a language preset.
 */
export const playwright = [
  {
    files: [
      '**/tests/e2e/**/*.{spec,setup}.ts',
      '**/e2e/**/*.spec.ts',
      '**/playwright.config.{ts,mts}',
    ],
    rules: {
      // Tests and projects are generated per viewport, locale or route, and
      // locator checks run in order inside a test.
      'functional/no-loop-statements': 'off',
      // A `describe` block or setup step covers a whole page or sign-in flow,
      // so its length follows the page, not its complexity.
      'max-lines-per-function': 'off',
      // Expected-data tables use the page's labels and the API's field names
      // as keys (`Browse`, `release_notes`), which a test cannot rename.
      '@typescript-eslint/naming-convention': [
        'error',
        ...namingConvention,
        { selector: 'objectLiteralProperty', format: null },
      ],
    },
  },
]

export default playwright
