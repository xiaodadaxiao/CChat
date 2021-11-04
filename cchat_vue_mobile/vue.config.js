const path = require('path');

//const isProduction = process.env.NODE_ENV == 'production';
const isProduction = false;

function resolvePath(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', resolvePath('src'));
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
