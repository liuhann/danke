module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/require-default-prop': 'off',
    "vue/max-attributes-per-line": 'off',
    'vue/html-self-closing': 'off',
    'vue/singleline-html-element-content-newline': 'off'
  }
}
