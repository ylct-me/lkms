module.exports = {
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-unused-vars": 1,
    "vue/max-attributes-per-line": "off",
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/html-self-closing": "off"
  },
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/strongly-recommended", "eslint:recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser"
  }
};
