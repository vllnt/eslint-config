import simpleImportSort from 'eslint-plugin-simple-import-sort'

export const imports = {
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'sort-imports': 'off',
    'no-duplicate-imports': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^react$', '^node:'],
          ['^[^.]'],

          ['^@/'],
          ['^../'],
          ['^./'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
}
