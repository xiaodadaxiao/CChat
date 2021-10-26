const mutations = {
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
};
export default mutations;
