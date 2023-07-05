/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["import"],
  rules: {
    "import/order": [
      "error",
      {
        alphabetize: { caseInsensitive: true, order: "asc" },
        groups: ["builtin", "external", "internal", "parent", "sibling"],
        "newlines-between": "always"
      }
    ]
  }
};