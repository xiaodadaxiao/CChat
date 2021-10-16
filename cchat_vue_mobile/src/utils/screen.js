import { Dialog } from 'vant'

export default function checkScreen() {
    let screenW = document.documentElement.clientWidth
    if (screenW > 420) {
        Dialog.alert({
            title: '设备宽度过大',
            message: '请使用移动端设备浏览器获得最佳体验'
        })
    }
}

