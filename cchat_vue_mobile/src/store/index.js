import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutation';
import getters from './getter';
import actions from './action';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false, //是否登录
    userCid: '',
    friendApplyList: [], //好友申请列表
    groupApplyList: [], //群申请列表
    indexMessage: [], //首页聊天信息
  },
  mutations,
  actions,
  getters,
  modules: {},
});
