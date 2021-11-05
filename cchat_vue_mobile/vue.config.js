const path = require('path');

const isProduction = process.env.NODE_ENV.trim() == 'production';
const cdnConfig = require('./cdn.config');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
function resolvePath(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', resolvePath('src'));
    //动态插入js cdn
    if (isProduction) {
      config.plugin('html').tap(args => {
        args[0].cdn = cdnConfig.build;
        return args;
      });
    }
  },
  configureWebpack: config => {
    if (isProduction) {
      // 使用cdn
      config.externals = cdnConfig.externals;
      //插件
      config.plugins.push(
        // 打包生产.gz包
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.html$|\.css/, // 匹配的文件名
          threshold: 10240, // 文件超过10k，进行gzip压缩
          minRatio: 0.8,
          deleteOriginalAssets: false, // 是否删除原文件
        }),
        //代码压缩
        new UglifyJsPlugin({
          uglifyOptions: {
            mangle: false,
            output: {
              beautify: true,
              comments: false, //去注释
            },
            compress: {
              //drop_console: true,
              //drop_debugger: false,
              //pure_funcs:['console.log']//移除console.log
            },
            sourceMap: true, //去除打包后的map
          },
        })
      );
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import '~@/assets/css/common.less';`,
        },
      },
    },
  },
};
