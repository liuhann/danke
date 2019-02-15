module.exports = {
  lintOnSave: false,
  transpileDependencies: ['async-boot'],
  devServer: {
    contentBase: './demo'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/danke/'
    : '/',
  outputDir: process.env.NODE_ENV === 'production'
    ? '../shopen-bcc/public/danke'
    : '../shopen-bcc/public/danke',
  pages: {
    index: {
      entry: 'app/main.js',
      template: 'app/index.html',
      filename: 'index.html'
    },
    site: {
      entry: 'site/main.js',
      template: 'site/index.html',
      filename: 'site.html'
    }
  }
}
