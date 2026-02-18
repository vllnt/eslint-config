import turboPlugin from 'eslint-plugin-turbo'

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
