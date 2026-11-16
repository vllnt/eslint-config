import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'
import { goodPractices, goodPracticesTsx, goodPracticesTest } from './core/good-practices.js'
import { imports } from './core/imports.js'
import { format } from './core/format.js'
import { unicornConfig, unicornTsx, unicornFilename } from './core/unicorn.js'
import {
  namingConvention,
  typescriptConfig,
  typescriptTsx,
  typescriptTest,
  typescriptDecorator,
} from './core/typescript.js'
import { reactConfig } from './core/react.js'

// The methods Next.js 16 accepts as route handler exports (route.md).
const HTTP_METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
const httpMethodPattern = HTTP_METHODS.join('|')
// `generateStaticParams` is the one other function a route file may export;
// the segment config exports (`dynamic`, `revalidate`, `runtime`, ...) are
// camelCase constants, so the base naming rule already accepts them.
const routeFunctionPattern = [...HTTP_METHODS, 'generateStaticParams'].join('|')
const routeExportMessage = `Only the HTTP method handlers (${HTTP_METHODS.join(', ')}) and generateStaticParams may be exported as functions from route.ts`

export const nextjs = tseslint.config(
  {
    // Next.js build output and generated files, as `create-next-app` ignores them.
    // Generic names match only at the config root so a source folder called
    // `build` or `out` deeper in the tree stays linted.
    ignores: ['**/.next/**', '**/next-env.d.ts', 'build/**', 'out/**'],
  },
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
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...Object.fromEntries(
        Object.entries({
          ...nextPlugin.configs.recommended.rules,
          ...nextPlugin.configs['core-web-vitals'].rules,
        }).map(([rule, config]) => [
          rule,
          config === 'warn' ? 'error' : config,
        ]),
      ),
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
  {
    files: ['**/app/**/page.{js,jsx,ts,tsx}', '**/app/**/layout.{js,jsx,ts,tsx}'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  {
    // Route handlers are named after the HTTP method, so accept exactly those
    // exported function names; every other name keeps the base convention.
    files: ['**/app/**/route.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        ...namingConvention,
        {
          selector: 'function',
          modifiers: ['exported'],
          format: null,
          filter: { regex: `^(${httpMethodPattern})$`, match: true },
        },
      ],
    },
  },
  {
    files: ['**/app/api/**/route.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `ExportNamedDeclaration > FunctionDeclaration:not([id.name=/^(${routeFunctionPattern})$/])`,
          message: routeExportMessage,
        },
        {
          selector: `ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[init.type=/^(ArrowFunctionExpression|FunctionExpression)$/]:not([id.name=/^(${routeFunctionPattern})$/])`,
          message: routeExportMessage,
        },
      ],
    },
  },
)

export default nextjs
