const path = require('path');

function resolvePath(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('@', resolvePath('src'));
  },
  //hack: `true; @import './assets/css/common.less';`

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
