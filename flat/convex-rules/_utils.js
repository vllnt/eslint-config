/**
 * Shared utilities for convex-rules ESLint plugin.
 */

/** Convex factory function names that create registered functions. */
export const CONVEX_FACTORIES = new Set([
  'query',
  'mutation',
  'action',
  'internalQuery',
  'internalMutation',
  'internalAction',
])

/** Standard filenames allowed to contain Convex factory exports. */
export const STANDARD_CONVEX_FILENAMES = new Set([
  'queries.ts',
  'mutations.ts',
  'actions.ts',
  'internal_mutations.ts',
])

/**
 * Check if a CallExpression node is a Convex factory call.
 * Handles direct calls: query({...}), mutation({...}), etc.
 *
 * @param {import("eslint").Rule.Node} node
 * @returns {{ factoryType: string } | null}
 */
export function getConvexFactory(node) {
  if (node.type !== 'CallExpression') return null
  const callee = node.callee
  if (callee.type === 'Identifier' && CONVEX_FACTORIES.has(callee.name)) {
    return { factoryType: callee.name }
  }
  return null
}

/**
 * @param {string} filePath
 * @returns {string}
 */
export function getBasename(filePath) {
  return filePath.split('/').pop() ?? filePath
}

/**
 * @param {string} filePath
 * @returns {string}
 */
export function getBasenameNoExt(filePath) {
  const base = getBasename(filePath)
  const dot = base.lastIndexOf('.')
  return dot === -1 ? base : base.slice(0, dot)
}

/**
 * @param {import("eslint").Rule.RuleContext} context
 * @returns {string}
 */
export function getFilename(context) {
  return context.physicalFilename ?? context.filename ?? ''
}

/**
 * @param {string} filePath
 * @returns {boolean}
 */
export function isTestFile(filePath) {
  return filePath.includes('.test.ts') || filePath.includes('/testing/')
}
