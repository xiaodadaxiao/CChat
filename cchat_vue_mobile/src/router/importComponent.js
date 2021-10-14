export default function importComponent() {
    const components = {}
    const files = require.context("@/views", true, /\.vue$/);
    files.keys().forEach(key => {
        //组件名
        const componentName = key.match(/([A-Za-z0-9]*)\.vue$/)[1];
        //导入[去除substr“.”]
        components[componentName] = () => import(`@/views${key.substr(1)}`)
    })
    return components
}