import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoagin: false, //是否登录
    friendApplyList: [], //好友申请列表
  },
  mutations: {
    useIsLogin(state, flag) {
      state.isLoagin = flag;
    },
    useFriendApplyList(state, list) {
      state.friendApplyList = list;
    },
  },
  actions: {},
  modules: {},
});
