import turboPlugin from 'eslint-plugin-turbo'

/**
 * Turborepo addition: eslint-plugin-turbo recommended rules. Spread it after a language preset.
 */
export const turbo = [
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      ...turboPlugin.configs.recommended.rules,
    },
  },
]

export default turbo
