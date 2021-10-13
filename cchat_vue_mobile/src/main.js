import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
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
