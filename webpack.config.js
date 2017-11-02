const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = (env) => {
  const __DEV__ = !!env.development; // eslint-disable-line
  const __PROD__ = !!env.production; // eslint-disable-line

  const PATHS = {
    app: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist'),
    publicPath: '/',
  };

  const config = {
    output: {
      path: PATHS.dist,
      publicPath: PATHS.publicPath,
      filename: '[name]-[hash].js',
      // chunkFilename: '[id].chunk.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env']
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: __PROD__ ? 'js/vendor.[hash:8].js' : 'js/vendor.js',
        minChunks: 3 // 提取使用3次以上的模块，打包到vendor里
      }),
    ],
    devServer: {
      publicPath: PATHS.publicPath,
      contentBase: PATHS.dist,
      compress: true,
      inline: true,
      port: 8080, //默认8080
      inline: true, //可以监控js变化
      hot: true, //热启动
    },
  };

  const entries = glob.sync('./src/views/*/index.js');
  const entriHtml = glob.sync('./src/views/*/index.html');
  const entryJsList = {};
  const entryHtmlList = {};


  // 生成js文件名
  for (let jsPath of entries) {
    const chunkName = jsPath.split('/')[3];
    entryJsList[chunkName] = jsPath;
  }

  // 生成html文件名
  for (let path of entriHtml) {
    const chunkName = path.split('/')[3];
    entryHtmlList[chunkName] = path;
    config.plugins.push(new HtmlWebpackPlugin({
      template: entryHtmlList[chunkName],
      filename: `${PATHS.dist}/pages/${chunkName}/index.html`,
      chunks: chunkName,
      inject: 'body',
    }))
  }

  config.entry = entryJsList;

  if (__DEV__) {
    config.output.filename = 'app.js';
    config.devtool = 'inline-source-map';
    // config.entry.push(
    //   'webpack-dev-server/client?http://localhost:8080',
    //   'webpack/hot/only-dev-servers');
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(true),
      }),
      new WriteFilePlugin(),
      new webpack.HotModuleReplacementPlugin());
  }

  return config;
};