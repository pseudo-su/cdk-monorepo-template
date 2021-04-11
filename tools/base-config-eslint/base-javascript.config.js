module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
};

module.exports = {
  plugins: ["eslint-plugin-import", "eslint-plugin-prettier"],
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:unicorn/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  rules: {
    "unicorn/prevent-abbreviations": "off",

    // allow setting null on object literals
    "unicorn/no-null": "off",

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
