//webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const configs = require('./public/config')[isDev ? 'dev' : 'build'];
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), //必须是绝对路径
    filename: 'bundle.js',
    publicPath: '/', //通常是CDN地址
  },

  //webpack的默认配置
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
        exclude: /node_modules/, //排除 node_modules 目录
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            // options: {
            //   plugins: function () {
            //     return [
            //       require('autoprefixer')({
            //         overrideBrowserslist: ['>0.25%', 'not dead'],
            //       }),
            //     ];
            //   },
            // },
          },
          'less-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, //10K
              esModule: false,
              outputPath: 'assets',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /.html$/,
        use: 'html-withimg-loader',
      },
    ],
  },

  plugins: [
    //数组 放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html', //打包后的文件名
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      // hash: true //是否加上hash，默认是 false
      config: configs.template,
    }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'public/js/*.js',
    //       to: path.resolve(__dirname, 'dist', 'js'),
    //       // flatten: true,
    //     },
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      //个人习惯将css文件放在单独目录下
      //publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
    }),
    new OptimizeCssPlugin(),
    new webpack.HotModuleReplacementPlugin(), //热更新插件
  ],
  devServer: {
    open: true,
    hot: true,
    port: '3000', //默认是8080
    quiet: false, //默认不启用
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: 'errors-only', //终端仅打印 error
    overlay: false, //默认不启用
    clientLogLevel: 'silent', //日志等级
    compress: true, //是否启用 gzip 压缩
  },
  devtool: 'cheap-module-eval-source-map', //开发环境下使用
};
