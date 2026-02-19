/**
 * Rule: namespace-separation
 * Enforces that Convex factory functions only appear in their designated files:
 *   - query / internalQuery -> queries.ts
 *   - mutation / internalMutation -> mutations.ts or internal_mutations.ts
 *   - action / internalAction -> actions.ts
 */

import { getConvexFactory, getBasename, getFilename } from './_utils.js'

/**
 * @param {string} factoryType
 * @returns {{ expectedFile: string; isAllowed: (basename: string) => boolean } | null}
 */
function getAllowedFile(factoryType) {
  switch (factoryType) {
    case 'query':
    case 'internalQuery':
      return {
        expectedFile: 'queries.ts',
        isAllowed: (b) => b === 'queries.ts',
      }
    case 'mutation':
    case 'internalMutation':
      return {
        expectedFile: 'mutations.ts or internal_mutations.ts',
        isAllowed: (b) => b === 'mutations.ts' || b === 'internal_mutations.ts',
      }
    case 'action':
    case 'internalAction':
      return {
        expectedFile: 'actions.ts',
        isAllowed: (b) => b === 'actions.ts',
      }
    default:
      return null
  }
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Convex factory functions must be in their designated namespace files',
    },
    messages: {
      wrongNamespace:
        '{{factoryType}}() exports must be in {{expectedFile}}, not "{{actualFile}}". Move this function to the correct file.',
    },
    schema: [],
  },

  create(context) {
    const filename = getFilename(context)
    const basename = getBasename(filename)

    return {
      ExportNamedDeclaration(node) {
        const decl = node.declaration
        if (!decl || decl.type !== 'VariableDeclaration') return

        for (const declarator of decl.declarations) {
          const init = declarator.init
          if (!init) continue
          const factory = getConvexFactory(init)
          if (!factory) continue

          const allowed = getAllowedFile(factory.factoryType)
          if (!allowed) continue

          if (!allowed.isAllowed(basename)) {
            context.report({
              node: declarator,
              messageId: 'wrongNamespace',
              data: {
                factoryType: factory.factoryType,
                expectedFile: allowed.expectedFile,
                actualFile: basename,
              },
            })
          }
        }
      },
    }
  },
}

export default rule
