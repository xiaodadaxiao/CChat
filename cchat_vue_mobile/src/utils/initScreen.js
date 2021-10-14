
/* 初始化屏幕宽度为750rem */
export default function initScreen() {
    let screenW = document.documentElement.clientWidth
    console.log("screenW:", screenW);
    let size = screenW / 750
    document.querySelector('html').style.fontSize = size + 'px'
}