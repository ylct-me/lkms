// const path = require('path')
// function resolve(dir) {
//   return path.join(__dirname, dir)
// }

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  runtimeCompiler: true,
  // chainWebpack: (config) => {
  //   config.module
  //     .rule('eslint')
  //     .use('eslint-loader')
  //     .options({
  //       fix: true,
  //     });
  // },
  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    // proxy: {
    //   '/': {
    //     target: process.env.VUE_APP_API_URL,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api/': '',
    //     },
    //   },
    // },
  },
  transpileDependencies: [
    'vuetify',
    'vuex-persist'
  ],
}
