const path = require('path')
function resolvePath(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    chainWebpack: config => {
        config.resolve.alias.
            set("@", resolvePath("src"))
    },
    css: {
        loaderOptions: {
            less: {
                globalVars: {
                    //公共样式变量
                    hack: `true; @import '~@/assets/css/common.less';`
                },
            }
        }
    }
}