module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018
  },
  env: {
    node: true,
    es6: true
  },
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["*.test.js"],
      env: {
        jest: true
      }
    }
  ]
};
