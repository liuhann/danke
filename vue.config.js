module.exports = {
  lintOnSave: false,
  productionSourceMap: true,
  transpileDependencies: ['async-boot', 'ky'],
  devServer: {
    contentBase: './demo',
    port: 80
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  outputDir: process.env.NODE_ENV === 'production'
    ? '../shopen/public'
    : '../shopen/public',
  pages: {
    index: {
      entry: 'app/main.js',
      template: 'app/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    // remove the prefetch plugin
    config.plugins.delete('prefetch-index')
  }
}
