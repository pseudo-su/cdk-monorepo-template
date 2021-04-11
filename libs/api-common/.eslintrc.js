module.exports = {
  root: true,
  extends: [
    require.resolve("@build-tools/base-config-eslint/base-javascript.config"),
    "plugin:node/recommended-script",
  ],
  rules: {
    // Use camelCase for files (and directories - not enforced)
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          kebabCase: true,
          camelCase: false,
          pascalCase: false,
        },
      },
    ],
  },
};
