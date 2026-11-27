import functionalPlugin from 'eslint-plugin-functional'
import writeGoodCommentsPlugin from 'eslint-plugin-write-good-comments'
import { withLegacyContext } from './compat.js'

export const goodPractices = {
  plugins: {
    functional: functionalPlugin,
    'write-good-comments': withLegacyContext(writeGoodCommentsPlugin),
  },
  rules: {
    'no-unreachable-loop': 'error',
    'prefer-const': 'error',
    'no-async-promise-executor': 'error',
    'no-console': ['error', { allow: ['debug', 'error', 'info', 'warn'] }],
    'write-good-comments/write-good-comments': 'error',
    'max-params': ['error', 3],
    'max-lines-per-function': [
      'error',
      {
        max: 30,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'no-param-reassign': 'error',
    'max-depth': ['error', 3],
    'functional/no-loop-statements': 'error',
    'functional/functional-parameters': [
      'error',
      {
        allowRestParameter: true,
        allowArgumentsKeyword: false,
        enforceParameterCount: false,
      },
    ],
    'functional/readonly-type': ['error', 'keyword'],
  },
}

export const goodPracticesTsx = {
  files: ['**/*.tsx'],
  rules: {
    'max-lines-per-function': [
      'error',
      {
        max: 70,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
  },
}

export const goodPracticesTest = {
  files: ['**/*.test.ts', '**/*.spec.ts', '**/*.e2e.ts'],
  rules: {
    'max-lines-per-function': 'off',
  },
}
