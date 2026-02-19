/**
 * Rule: no-query-in-loop
 * Flags ctx.db.query(), ctx.db.get(), and ctx.runQuery() inside loop bodies.
 * These cause N+1 query performance issues. Use Promise.all() with .map() instead.
 *
 * NOT flagged:
 *   - Promise.all(items.map(id => ctx.db.get(id))) — .map() creates a function boundary
 *   - for (const x of await ctx.db.query(...).take(500)) — query is the iterable, not in the body
 */

const LOOP_STATEMENT_TYPES = new Set([
  'ForStatement',
  'WhileStatement',
  'ForOfStatement',
  'ForInStatement',
  'DoWhileStatement',
])

const FUNCTION_BOUNDARY_TYPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
])

/**
 * @param {import("estree").CallExpression} node
 * @returns {boolean}
 */
function isConvexDbCall(node) {
  const { callee } = node

  if (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'ctx' &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'runQuery'
  ) {
    return true
  }

  if (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.object.type === 'MemberExpression' &&
    !callee.object.computed &&
    callee.object.object.type === 'Identifier' &&
    callee.object.object.name === 'ctx' &&
    callee.object.property.type === 'Identifier' &&
    callee.object.property.name === 'db' &&
    callee.property.type === 'Identifier' &&
    (callee.property.name === 'query' || callee.property.name === 'get')
  ) {
    return true
  }

  return false
}

/**
 * @param {import("eslint").Rule.Node} node
 * @returns {boolean}
 */
function isInsideLoopBody(node) {
  let current = node
  while (current.parent) {
    const parent = current.parent

    if (FUNCTION_BOUNDARY_TYPES.has(parent.type)) {
      return false
    }

    if (LOOP_STATEMENT_TYPES.has(parent.type)) {
      return parent.body === current
    }

    current = parent
  }
  return false
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent N+1 queries by disallowing ctx.db.query/get/runQuery inside loop bodies',
    },
    messages: {
      noQueryInLoop:
        'Database query/get inside a loop creates N+1 performance issues. Use Promise.all() with .map() for batch fetching.',
    },
    schema: [],
  },

  create(context) {
    return {
      CallExpression(node) {
        if (!isConvexDbCall(node)) return

        if (isInsideLoopBody(node)) {
          context.report({
            node,
            messageId: 'noQueryInLoop',
          })
        }
      },
    }
  },
}

export default rule
