import Vue from 'vue';
import Vuex from 'vuex';
import { getFriendApplyList } from '@/network/friend';
import { getGroupApplyList } from '@/network/group';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false, //是否登录
    friendApplyList: [], //好友申请列表
    groupApplyList: [], //群申请列表
  },
  mutations: {
    useIsLogin(state, flag) {
      state.isLogin = flag;
    },
    useFriendApplyList(state, list) {
      state.friendApplyList = list;
    },
    useGroupApplyList(state, list) {
      state.groupApplyList = list;
    },
  },
  actions: {
    async requestFriendApplyList({ commit }) {
      const friendRes = await getFriendApplyList();
      if (friendRes.status !== 200) friendRes.data = [];
      commit('useFriendApplyList', friendRes.data);
    },
    async requestGroupApplyList({ commit }) {
      const groupRes = await getGroupApplyList();
      if (groupRes.status !== 200) groupRes.data = [];
      commit('useGroupApplyList', groupRes.data);
    },
  },
  getters: {
    getApplyListCount(state) {
      return state.friendApplyList.length + state.groupApplyList.length;
    },
  },

  modules: {},
});
