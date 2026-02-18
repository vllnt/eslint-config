import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { goodPractices } from './core/good-practices.js'
import { imports } from './core/imports.js'
import { format } from './core/format.js'
import { unicornConfig } from './core/unicorn.js'
import { typescriptConfig } from './core/typescript.js'

export const base = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  goodPractices,
  imports,
  format,
  unicornConfig,
  typescriptConfig,
)
