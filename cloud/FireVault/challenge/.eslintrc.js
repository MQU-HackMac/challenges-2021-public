module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "google",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: [
    "./functions/*", // Ignore cloud functions.
    "./functions/**/*", // Ignore cloud functions.
  ],
  plugins: ["react", "@typescript-eslint", "simple-import-sort"],
  rules: {
    "indent": [2, 2, {SwitchCase: 1}],
    "simple-import-sort/imports": "error",
    "valid-jsdoc": ["off"],
    "require-jsdoc": ["off"],
    "react/prop-types": ["off"],
    // suppress errors for missing 'import React' in files
    "react/react-in-jsx-scope": "off",
    // allow jsx syntax in js files (for next.js project)
    "react/jsx-filename-extension": [
      1,
      {extensions: [".js", ".jsx", ".ts", ".tsx"]},
    ],
    "quotes": ["error", "double"],
  },
};
