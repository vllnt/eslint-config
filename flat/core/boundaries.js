import boundariesPlugin from 'eslint-plugin-boundaries'

export const boundariesConfig = {
  plugins: {
    boundaries: boundariesPlugin,
  },
  settings: {
    ...boundariesPlugin.configs.recommended.settings,
  },
  rules: {
    ...boundariesPlugin.configs.recommended.rules,
  },
}
