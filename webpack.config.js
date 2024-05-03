const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const path = require("path");

module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  entry: {
    // app: ["./src/reactAdapter/index.tsx","./src/index.ts"],
    app: ["./src/reactAdapter/reactIndex.tsx"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
      },
      
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".html"],
    plugins: [new TsconfigPathsPlugin()]
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
    // new BundleAnalyzerPlugin()
  ],
};
