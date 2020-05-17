module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["standard", "prettier"],
  plugins: ["prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    "prettier/prettier": "error",
    "no-param-reassing": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
