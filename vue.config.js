module.exports = {
  lintOnSave: false,
  devServer: {
    contentBase: './demo'
  },
  pages: {
    index: {
      entry: 'demo/basic/index.js',
      template: 'src/index.html',
      filename: 'index.html'
    },
    picture: {
      entry: 'demo/picture/index.js',
      template: 'src/index.html',
      filename: 'picture.html'
    }
  }
}
