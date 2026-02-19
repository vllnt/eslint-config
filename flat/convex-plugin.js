/**
 * eslint-plugin-convex-rules
 *
 * Custom ESLint rules enforcing Convex backend best practices:
 * structure, naming, query optimization, and type safety.
 *
 * Bundled with @vllnt/eslint-config — consumed via the convex preset.
 */

import standardFilenames from './convex-rules/standard-filenames.js'
import namespaceSeparation from './convex-rules/namespace-separation.js'
import noBareVAny from './convex-rules/no-bare-v-any.js'
import requireReturnsValidator from './convex-rules/require-returns-validator.js'
import noQueryInLoop from './convex-rules/no-query-in-loop.js'
import noFilterOnQuery from './convex-rules/no-filter-on-query.js'
import snakeCaseFilenames from './convex-rules/snake-case-filenames.js'

const plugin = {
  meta: {
    name: 'eslint-plugin-convex-rules',
    version: '1.0.0',
  },
  rules: {
    'standard-filenames': standardFilenames,
    'namespace-separation': namespaceSeparation,
    'no-bare-v-any': noBareVAny,
    'require-returns-validator': requireReturnsValidator,
    'no-query-in-loop': noQueryInLoop,
    'no-filter-on-query': noFilterOnQuery,
    'snake-case-filenames': snakeCaseFilenames,
  },
}

export default plugin
