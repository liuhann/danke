module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended'
  ],
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  rules: {
    'vue/no-v-html': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/require-default-prop': 'off',
    "vue/max-attributes-per-line": 'off',
    'vue/html-self-closing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-unused-components': 'off'
  }
}
