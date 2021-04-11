
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
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
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
  ignorePatterns: ["node_modules/**", "dist/**", "test-reports/**", "vendor/**", "cdk.out/**", "build/**", ".next/**"],
  rules: {

    "unicorn/prevent-abbreviations": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": "off",

    // allow setting null on object literals
    'unicorn/no-null': 'off',

    // Use camelCase for files (and directories - not enforced)
    'unicorn/filename-case': [
      'error',
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
