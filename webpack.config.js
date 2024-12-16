const path = require("path");

module.exports = {
  entry: {
    ui: "./static/input/ui.ts",
    canvas: "./static/input/canvas.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./static/output"), // Output to a separate folder
    clean: true,
  },
  mode: "development",
  watch: true,
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
