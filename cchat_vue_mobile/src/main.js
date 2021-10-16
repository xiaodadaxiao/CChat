import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'
import checkScreen from '@/utils/screen'

Vue.config.productionTip = false
/* 初始样式 */
import '@/assets/css/reset.css'
/* 检查屏幕 */
checkScreen()
/* 注册vant */
import '@/plugins/vant'
/* 初始化socket.io */
import '@/plugins/socket.js'


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
