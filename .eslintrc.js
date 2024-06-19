module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'preferred-import', 'unused-imports'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react/react-in-jsx-scope': 'off',
        'eslint-disable-next-line': 'off',
        'react-native/no-inline-styles': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        'react-hooks/exhaustive-deps': 'off',
        'preferred-import/ts-imports': 'error',
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  ],
};
