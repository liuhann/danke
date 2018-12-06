module.exports = {
  presets: [
    '@vue/babel-preset-app'
  ],
  plugins: [
    ['import', {
      'libraryName': 'vant',
      'libraryDirectory': 'es',
      'style': true
    }]
  ]
}
