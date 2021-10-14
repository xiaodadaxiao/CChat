import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoagin: false,//是否登录
  },
  mutations: {
    useIsLogin(state, flag) {
      state.isLoagin = flag
    }
  },
  actions: {
  },
  modules: {
  }
})
