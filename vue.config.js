module.exports = {
  lintOnSave: false,
  devServer: {
    contentBase: './demo'
  },
  pages: {
    index: {
      entry: 'app/main.js',
      template: 'app/index.html',
      filename: 'index.html'
    }
  }
}
