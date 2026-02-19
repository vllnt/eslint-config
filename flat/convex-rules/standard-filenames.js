/**
 * Rule: standard-filenames
 * Convex factory exports (query, mutation, action, etc.) must live in
 * standard-named files: queries.ts, mutations.ts, actions.ts, or internal_mutations.ts.
 */

import {
  STANDARD_CONVEX_FILENAMES,
  getConvexFactory,
  getBasename,
  getFilename,
} from './_utils.js'

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Convex factory exports must be in standard-named files (queries.ts, mutations.ts, actions.ts, internal_mutations.ts)',
    },
    messages: {
      wrongFilename:
        'Convex {{factoryType}}() exports must be in a standard-named file (queries.ts, mutations.ts, actions.ts, or internal_mutations.ts). Found in "{{filename}}".',
    },
    schema: [],
  },

  create(context) {
    const filename = getFilename(context)
    const basename = getBasename(filename)

    if (STANDARD_CONVEX_FILENAMES.has(basename)) {
      return {}
    }

    return {
      ExportNamedDeclaration(node) {
        const decl = node.declaration
        if (!decl || decl.type !== 'VariableDeclaration') return

        for (const declarator of decl.declarations) {
          const init = declarator.init
          if (!init) continue
          const factory = getConvexFactory(init)
          if (!factory) continue

          context.report({
            node: declarator,
            messageId: 'wrongFilename',
            data: {
              factoryType: factory.factoryType,
              filename: basename,
            },
          })
        }
      },
    }
  },
}

export default rule
