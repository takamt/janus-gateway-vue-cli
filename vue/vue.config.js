const path = require("path");
const webpack = require("webpack");

module.exports = {
  pages: {
    index: {
      entry: "src/main.js",
      template: "templates/base.html",
      filename: "index.html",
      title: 'Index Page',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  filenameHashing: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
        // janus.js does not use 'export' to provide its functionality to others, instead
        // it creates a global variable called 'Janus' and expects consumers to use it.
        // Let's use 'exports-loader' to simulate it uses 'export'.
        {
          test: require.resolve("janus-gateway"),
          loader: "exports-loader",
          options: {
            exports: "Janus",
          },
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
      }
    },
    plugins: [
      // janus.js does not use 'import' to access to the functionality of webrtc-adapter,
      // instead it expects a global object called 'adapter' for that.
      // Let's make that object available.
      new webpack.ProvidePlugin({ adapter: ["webrtc-adapter", "default"] }),
    ],
  },
};
