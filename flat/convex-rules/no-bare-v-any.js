/**
 * Rule: no-bare-v-any
 * Bans bare `v.any()` calls outside of validators.ts files and test files.
 * Define named aliases in a validators.ts file instead.
 */

import { getFilename, isTestFile } from './_utils.js'

/**
 * @param {string} filePath
 * @returns {boolean}
 */
function isValidatorsFile(filePath) {
  return filePath.endsWith('/validators.ts') || filePath.endsWith('\\validators.ts')
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Bare v.any() is not allowed outside of validators.ts. Use a named alias.',
    },
    messages: {
      noBareVAny:
        'Bare v.any() is not allowed. Define a named alias in a validators.ts file instead.',
    },
    schema: [],
  },

  create(context) {
    const filename = getFilename(context)

    if (isValidatorsFile(filename) || isTestFile(filename)) {
      return {}
    }

    return {
      CallExpression(node) {
        const { callee } = node

        if (
          callee.type === 'MemberExpression' &&
          !callee.computed &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'v' &&
          callee.property.type === 'Identifier' &&
          callee.property.name === 'any'
        ) {
          context.report({
            node,
            messageId: 'noBareVAny',
          })
        }
      },
    }
  },
}

export default rule
