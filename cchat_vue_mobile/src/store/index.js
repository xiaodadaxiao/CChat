import Vue from 'vue';
import Vuex from 'vuex';
import { getFriendApplyList } from '@/network/friend';
import { getGroupApplyList } from '@/network/group';
import { getIndexMessage } from '@/network/chat';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false, //是否登录
    userCid: '',
    friendApplyList: [], //好友申请列表
    groupApplyList: [], //群申请列表
    indexMessage: [], //首页聊天信息
  },
  mutations: {
    useIsLogin(state, payload) {
      state.isLogin = payload.flag;
      state.userCid = payload.cid || '';
    },
    useFriendApplyList(state, list) {
      state.friendApplyList = list;
    },
    useGroupApplyList(state, list) {
      state.groupApplyList = list;
    },
    useIndexMessage(state, list) {
      state.indexMessage = list;
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
    async requestIndexMessage({ commit }) {
      const messageRes = await getIndexMessage();
      if (messageRes.status !== 200) return;
      commit('useIndexMessage', messageRes.data);
    },
  },
  getters: {
    getApplyListCount(state) {
      return state.friendApplyList.length + state.groupApplyList.length;
    },
    getIndexCount({ indexMessage }) {
      let count = 0;
      indexMessage.forEach(m => {
        count += m.data.count;
      });
      return count;
    },
  },

  modules: {},
});
