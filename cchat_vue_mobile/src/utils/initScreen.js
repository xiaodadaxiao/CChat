import { Dialog } from 'vant'
/* 初始化屏幕宽度为750rem */
function init() {
    let screenW = document.documentElement.clientWidth
    if (screenW > 420) {
        Dialog.alert({
            title: '设备宽度过大',
            message: '请使用移动端设备浏览器获得最佳体验'
        })
    }
    let size = screenW / 750
    document.querySelector('html').style.fontSize = size + 'px'

}
export default function initScreen() {
    init()
    //监听屏幕变化
    window.onresize = function () {
        init()
    }
}