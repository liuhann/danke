module.exports = {
  presets: [
    '@vue/babel-preset-app', '@babel/preset-react'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    '@babel/plugin-proposal-nullish-coalescing-operator'
    // ["@babel/plugin-proposal-object-rest-spread", {}]
  ]
}
