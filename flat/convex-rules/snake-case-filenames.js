/**
 * Rule: snake-case-filenames
 * Files in convex/ must use snake_case naming (underscores, not hyphens).
 * Reports once per file on the Program node.
 *
 * Exempt: _generated/, uppercase-starting names, non-TS files.
 */

import { getFilename, getBasenameNoExt } from './_utils.js'

const SNAKE_CASE_RE = /^[a-z][a-z0-9_]*$/

/**
 * @param {string} name
 * @returns {string}
 */
function suggest(name) {
  return name.replaceAll('-', '_')
}

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Files in convex/ must use snake_case naming (no hyphens)',
    },
    fixable: null,
    hasSuggestions: true,
    messages: {
      notSnakeCase:
        'File "{{filename}}" must use snake_case naming in convex/. Rename to "{{suggested}}".',
    },
    schema: [],
  },

  create(context) {
    const filePath = getFilename(context)

    if (!filePath.includes('/convex/')) return {}
    if (filePath.includes('/_generated/')) return {}
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.mjs')) return {}

    const baseName = getBasenameNoExt(filePath)

    if (
      baseName.length > 0 &&
      baseName[0] === baseName[0].toUpperCase() &&
      baseName[0] !== baseName[0].toLowerCase()
    ) {
      return {}
    }

    if (SNAKE_CASE_RE.test(baseName)) return {}

    return {
      Program(node) {
        const suggestedName = suggest(baseName)
        const fullBasename = filePath.split('/').pop() ?? filePath
        const extMatch = fullBasename.match(/(\.[^.]+)$/)
        const ext = extMatch ? extMatch[1] : ''
        const suggestedFull = suggestedName + ext

        context.report({
          node,
          messageId: 'notSnakeCase',
          data: {
            filename: fullBasename,
            suggested: suggestedFull,
          },
        })
      },
    }
  },
}

export default rule
