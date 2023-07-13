module.exports = {
  extends: ['@bjerk/eslint-config'],
  ignorePatterns: ['dist'],
  rules: {
    'import/no-default-export': 'off',
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
