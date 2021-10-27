import { getFriendApplyList } from '@/network/friend';
import { getGroupApplyList } from '@/network/group';
import { getIndexMessage } from '@/network/chat';
import * as messageType from '@/constant/message';
const actions = {
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

  //新的好友消息
  socket_friendMessage({ state, commit, dispatch }, data) {
    /* 处理首页数据 */
    const index = state.indexMessage.findIndex(item => {
      return item.type == messageType.CHAT_FRIEND && item.data.friend_cid == data.talker_cid;
    });
    if (index == -1) {
      //重新请求数据
      dispatch('requestIndexMessage');
    } else {
      //修改数据
      commit('changeIndexFriendMessage', [index, data]);
    }
  },
  //新的群消息
  socket_groupMessage({ state, commit, dispatch }, data) {
    /* 处理首页数据 */
    const index = state.indexMessage.findIndex(item => {
      return item.type == messageType.CHAT_GROUP && item.data.gid == data.gid;
    });
    if (index == -1) {
      //重新请求数据
      dispatch('requestIndexMessage');
    } else {
      commit('changeIndexGroupMessage', [index, data]);
    }
  },
};
export default actions;
