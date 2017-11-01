'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pkg = require('./package.json');
const pxtorem = require('postcss-pxtorem');

const prod = process.env.NODE_ENV === 'production';
const hotEntry = [
  'webpack/hot/dev-server',
  'webpack-hot-middleware/client?reload=true',
];
//入口文件
const entry = path.resolve(__dirname, 'src/app');
//const ksEntry = './src/pages/kitchen-sink/entry.js';

let minify = prod ? {
  // 压缩HTML文件
  removeComments: true,
  // 移除HTML中的注释
  collapseWhitespace: true,
    // 删除空白符与换行符
  minifyCSS: true
} : false;
//入口模板加载
let plugins = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    prod,
    chunks: ['entry'],
    // 指定引入的chunk，根据entry的key配置，不配置就会引入所有页面的资源
    minify,
  }),
  //new HtmlWebpackPlugin({
  //  filename: './src/pages/kitchen-sink/index.html',
  //  template: './src/pages/kitchen-sink/index.html',
  //  chunks: ['ks'],
  //  minify,
  //}),
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(pkg.version),
    SERVER_RENDING: false,
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'NODE_PUB':JSON.stringify(process.env.NODE_PUB || ''),
    },
  }),
];


// function getTingleModuleAlias() {
//   const alias = {};
//
//   // 判断是否存在tingle目录
//   if (!fs.existsSync('./tingle')) return alias;
//
//   const modules = fs.readdirSync('./tingle');
//   modules.forEach(function (name) {
//     alias[name] = [process.cwd(), 'tingle', name, 'src'].join('/');
//   });
//   return alias;
// }
plugins = prod ? plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_debugger: true,
      drop_console: true
    }
  }),
  new ExtractTextPlugin('[name].[hash:5].min.css',{allChunks: true }),
  new webpack.BannerPlugin(`build: ${new Date().toString()}`),
  new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/build/vendor-manifest.json')
        }),
]) : plugins.concat([
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  // 启用热替换,仅开发模式需要
  new webpack.NoErrorsPlugin(),
  // 允许错误不打断程序，,仅开发模式需要
  new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dist/build/vendor-manifest.json')
        }),//提供公用的内容
]);

module.exports = {
  devtool: prod ? null :'cheap-module-eval-source-map',
  entry: {
    entry: prod ? entry : [].concat(hotEntry).concat(entry),
    //ks: prod ? ksEntry : [].concat(hotEntry).concat(ksEntry),
  },
  output: {
    filename: `[name].[hash:5]${prod ? '.min' : ''}.js`,
    //sourceMapFilename: "[name].js.map",
    path: `${__dirname}/dist`,
    //publicPath: '/',// 服务器静态资源路径配置
    chunkFilename: prod ? '[name].[chunkhash:5].chunk.js':null,
  },
  //devtool: prod ? null : '#source-map',
  module: {
    loaders: [{
        test: /\.jsx?$/,
         exclude: function (path) {
                     const isNpmModule = !!path.match(/node_modules/);
                     const isGagModule = !!path.match(/node_modules[\/\\]\@gag/);
                     return isNpmModule && !isGagModule;
                 },
        loaders: [
          //'transform/cacheable?brfs',
          'babel',
        ]
      },{
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url?limit=10000'
      },{
        test: /\.md$/,
        loader: 'html!markdown'
      }, {
        test: /\.(less|css)$/,
        loader: prod ? ExtractTextPlugin.extract('style',
          'css?minimize!postcss!less') : 'style!css?sourceMap!postcss!less?sourceMap',
      },
      /*{
        test: /\.(ttf|svg|woff)$/,
        loader: 'file?name=[path][name].[ext]&context=src'
      },*/
      // @see https://shellmonger.com/2016/01/22/working-with-fonts-with-webpack/
      {
        test: /\.svg$/,
        loader: 'svg-sprite'
      },
      {
        test: /\.woff$/,
        loader: 'url?mimetype=application/font-woff&name=[name].[ext]'
      }, {
        test: /\.woff2$/,
        loader: 'url?mimetype=application/font-woff2&name=[name].[ext]'
      }, {
        test: /\.[ot]tf$/,
        loader: 'url?mimetype=application/octet-stream&name=[name].[ext]'
      },
    ]
  },
  resolve: {
    // 路径别名, 懒癌福音
    alias: {
      pages: path.resolve(__dirname, './src/pages'),
      // 以前你可能这样引用 import { Nav } from '../../components'
      // 现在你可以这样引用 import { Nav } from 'pages/components'
      components: path.resolve(__dirname, './src/components'),
      style: path.resolve(__dirname, 'src/styles'),
      images:path.resolve(__dirname, 'src/images'),
        // 以前你可能这样引用 import "../../../styles/mixins.scss"
        // 现在你可以这样引用 import "style/mixins.scss"

      // 注意：别名只能在.js文件中使用。
    },
    extensions: ['','.web.js', '.js', '.jsx'] //后缀名自动补全
  },
  externals: {
      //'react': 'var React', // 相当于把全局的React作为模块的返回 module.exports = React;
      //'react-dom': 'var ReactDOM'
    },
  plugins: plugins,
  postcss: function () {
    return [
      require('precss'),
      require('rucksack-css'),
      pxtorem({
        rootValue: 100,
        propWhiteList: [],
      }),
      autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'ie 10']
      })
    ];
  }
};
