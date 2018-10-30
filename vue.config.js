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
    },
    omaha: {
      entry: 'demo/omaha/index.js',
      template: 'src/index.html',
      filename: 'omaha.html'
    },
    xjtu2018autumn: {
      entry: 'demo/xjtu2018autumn/index.js',
      template: 'src/index.html',
      filename: 'xjtu2018autumn.html'
    }
  }
}
