/**
 * Rule: require-returns-validator
 * All Convex query/mutation/action factory calls must include a `returns` property
 * in their configuration object.
 */

import { getConvexFactory } from './_utils.js'

/**
 * @param {import("estree").ObjectExpression} objNode
 * @param {string} keyName
 * @returns {boolean}
 */
function hasProperty(objNode, keyName) {
  return objNode.properties.some(
    (prop) =>
      prop.type === 'Property' &&
      !prop.computed &&
      ((prop.key.type === 'Identifier' && prop.key.name === keyName) ||
        (prop.key.type === 'Literal' && prop.key.value === keyName)),
  )
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'All Convex factory functions must include a `returns` validator in their config object',
    },
    messages: {
      missingReturns:
        'Convex {{factoryType}}() must have a `returns` validator. Add `returns: v.null()` or the appropriate validator.',
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        const factory = getConvexFactory(node)
        if (!factory) return

        const configArg = node.arguments[0]
        if (!configArg || configArg.type !== 'ObjectExpression') return

        if (!hasProperty(configArg, 'returns')) {
          context.report({
            node,
            messageId: 'missingReturns',
            data: { factoryType: factory.factoryType },
          })
        }
      },
    }
  },
}

export default rule
