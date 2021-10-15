import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import store from '@/store'
// socket 连接参数
const socketOptions = {
    autoConnect: false,// 自动连接
}
Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:3000', socketOptions),
    vuex: {
        store,
        actionPrefix: "scoket_",
        mutationPrefix: "scoket_"
    },
}))