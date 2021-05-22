module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': [ '.ts', 'js' ]
    }
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'import/no-named-as-default': 'off',
    '@typescript-eslint/no-dupe-class-members': 'off',
    'import/prefer-default-export': 'off',
    "@typescript-eslint/no-unsafe-assignment": 'off',
    "@typescript-eslint/no-unsafe-return" :'off',
    '@typescript-eslint/no-unsafe-call' : 'off',
    '@typescript-eslint/no-unsafe-member-access' : 'off',
    '@typescript-eslint/restrict-template-expressions':'off'
  }
};
