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
                    "color-red": "#fd281a",
                    "color-blue": "#1890ff",
                },
            }
        }
    }
}