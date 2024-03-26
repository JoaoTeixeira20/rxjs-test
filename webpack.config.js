const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".html"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    watchFiles: ["src/page-entry/index.html"],
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/page-entry/index.html",
      filename: "index.html",
    }),
  ],
};
