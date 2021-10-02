module.exports = {
  mode: "development",

  module: {
    rules: [
      {
        // node_modules를 제외한 모든 js파일에 babel-loader를 사용
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },

  devtool: false,
  devServer: {
    // Live Reloading enabled.
    static: {
      directory: "./dist"
    }
  }
};