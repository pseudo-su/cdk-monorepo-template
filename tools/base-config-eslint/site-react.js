module.exports = {
  plugins: ["react", "react-hooks"],
  extends: [
    require.resolve("./base-typescript.config"),
    "plugin:react/recommended",
    "plugin:react/recommended",
    "plugin:import/react",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
