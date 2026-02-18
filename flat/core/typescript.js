export const typescriptConfig = {
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: 'Prefer union type',
      },
      {
        selector:
          'TSPropertySignature[optional=true] TSTypeAnnotation > TSUnionType > TSUndefinedKeyword',
        message:
          'Optional properties already include undefined; drop the union and prefer `?:`.',
      },
      {
        selector:
          'TSPropertySignature[optional=false] TSTypeAnnotation > TSUnionType > TSUndefinedKeyword',
        message:
          'Use optional properties instead of unions with `undefined` (e.g. `email?: string`).',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'import',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: ['variableLike'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        custom: {
          regex: '^(I|T)[A-Z]',
          match: false,
        },
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
      },
      {
        selector: 'enumMember',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'objectLiteralProperty',
        format: null,
        filter: {
          regex: '^/',
          match: true,
        },
      },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/dot-notation': 'error',
    '@typescript-eslint/consistent-indexed-object-style': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/consistent-generic-constructors': 'error',
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { 'ts-ignore': 'allow-with-description' },
    ],
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/no-base-to-string': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
  },
}

export const typescriptTsx = {
  files: ['**/*.tsx'],
  rules: {
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['function'],
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
    ],
  },
}

export const typescriptTest = {
  files: ['**/*.test.ts', '**/*.spec.ts', '**/*.e2e.ts'],
  rules: {
    '@typescript-eslint/no-unsafe-member-access': 'off',
  },
}

export const typescriptDecorator = {
  files: ['**/*.decorator.ts'],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['function'],
        format: ['camelCase', 'PascalCase'],
      },
    ],
  },
}
