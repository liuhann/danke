module.exports = {
  productionSourceMap: false,
  transpileDependencies: ['async-boot'],
  devServer: {
    host: 'localhost',
    contentBase: './public',
    port: 80
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  outputDir: process.env.NODE_ENV === 'production'
    ? '../shopen/public' // '../pwa-ybstory/cordova-story-v3/www'
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

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  },

  lintOnSave: undefined
}
