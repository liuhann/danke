module.exports = {
  presets: [
    '@vue/babel-preset-app'
  ],
  plugins: [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}
