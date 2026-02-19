/**
 * Rule: no-filter-on-query
 * Flags .filter() chained on a Convex query expression (after ctx.db.query()).
 * Full table scans must be replaced with .withIndex().
 *
 * Flagged:
 *   ctx.db.query("table").filter(q => q.eq(q.field("x"), 1))
 *
 * NOT flagged (array .filter() after await):
 *   const rows = await ctx.db.query("table").collect();
 *   rows.filter(r => r.x === 1);
 */

/**
 * @param {import("estree").Expression} node
 * @returns {boolean}
 */
function chainContainsQuery(node) {
  if (!node) return false

  if (node.type === 'CallExpression') {
    const { callee } = node
    if (
      callee.type === 'MemberExpression' &&
      !callee.computed &&
      callee.property.type === 'Identifier' &&
      callee.property.name === 'query'
    ) {
      return true
    }
    if (callee.type === 'MemberExpression') {
      return chainContainsQuery(callee.object)
    }
    return false
  }

  if (node.type === 'MemberExpression') {
    return chainContainsQuery(node.object)
  }

  return false
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow .filter() on Convex queries — use .withIndex() for indexed lookups',
    },
    messages: {
      noFilterOnQuery:
        "Don't use .filter() on Convex queries — it causes full table scans. Use .withIndex() instead.",
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node

        if (
          callee.type !== 'MemberExpression' ||
          callee.computed ||
          callee.property.type !== 'Identifier' ||
          callee.property.name !== 'filter'
        ) {
          return
        }

        const receiver = callee.object
        if (chainContainsQuery(receiver)) {
          context.report({
            node,
            messageId: 'noFilterOnQuery',
          })
        }
      },
    }
  },
}

export default rule
