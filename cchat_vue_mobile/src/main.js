import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import App from './App.vue'
import router from './router'
import store from './store'
import initScreen from '@/utils/initScreen'

Vue.config.productionTip = false
/* 初始样式 */
import '@/assets/css/reset.css'
/* 初始化rem */
initScreen()
/* 注册vant */
import '@/plugins/vant'

// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: SocketIO('http://localhost:3000'),
//   vuex: {
//     store,
//   },
// }))
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
