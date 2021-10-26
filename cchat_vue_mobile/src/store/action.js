import { getFriendApplyList } from '@/network/friend';
import { getGroupApplyList } from '@/network/group';
import { getIndexMessage } from '@/network/chat';

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
};
export default actions;
