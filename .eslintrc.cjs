module.exports = {
  extends: ['@bjerk/eslint-config'],
  rules: {
    'import/no-default-export': 'off',
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
