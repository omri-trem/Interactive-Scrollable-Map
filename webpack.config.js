const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve } = path;

module.exports = {
  entry: './src/index.js',
  output: {
    path: resolve('dist'),
    filename: 'app.bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'app.css',
    }),
  ],
  resolve: {
    alias: {
      GlobalComponents: path.resolve(__dirname, './src/components/'),
      Assets: path.resolve(__dirname, './src/assets/'),
      Src: path.resolve(__dirname, './src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.*css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract css into its own file
          'css-loader',
        ],
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, './dist'),
    // hot: true,
    inline: true,
    disableHostCheck: true,
    historyApiFallback: true,
  },
};
