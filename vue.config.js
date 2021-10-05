module.exports = {
  devServer: {
    disableHostCheck: true
  },
  publicPath: '/',
    css: {
      loaderOptions: {
        sass: {
          prependData: `@import "@/constraints.scss";`
        }
      }
    }
  };// vue.config.js
