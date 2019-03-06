module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: ['async-boot', 'ky'],
  devServer: {
    contentBase: './demo'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/user/'
    : '/',
  outputDir: process.env.NODE_ENV === 'production'
    ? '../shopen/public/user'
    : '../shopen/public/user',
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
