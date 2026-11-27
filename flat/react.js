import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { goodPractices, goodPracticesTsx, goodPracticesTest } from './core/good-practices.js'
import { imports } from './core/imports.js'
import { format } from './core/format.js'
import { unicornConfig, unicornTsx, unicornFilename } from './core/unicorn.js'
import { typescriptConfig, typescriptTsx, typescriptTest, typescriptDecorator } from './core/typescript.js'
import { reactConfig } from './core/react.js'

/**
 * React preset: everything in `base` plus eslint-plugin-react, react-hooks and jsx-a11y, with `.tsx` overrides.
 */
export const react = tseslint.config(
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
  goodPracticesTsx,
  goodPracticesTest,
  imports,
  format,
  unicornConfig,
  unicornTsx,
  unicornFilename,
  typescriptConfig,
  typescriptTsx,
  typescriptTest,
  typescriptDecorator,
  reactConfig,
)

export default react
