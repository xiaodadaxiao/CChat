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
  changeIndexFriendMessage({ indexMessage }, [index, data]) {
    let msg = indexMessage[index];
    //改变数值
    msg.data.content = data.content;
    msg.data.updateAt = data.updateAt;
    msg.data.type = data.type;
    msg.data.count++;
    //置顶
    indexMessage.splice(index, 1);
    indexMessage.unshift(msg);
  },
  changeIndexGroupMessage({ indexMessage }, [index, data]) {
    let msg = indexMessage[index];
    //改变数值
    msg.data.content = data.content;
    msg.data.nickname = data.nickname;
    msg.data.updateAt = data.updateAt;
    msg.data.type = data.type;
    msg.data.count++;
    //置顶
    indexMessage.splice(index, 1);
    indexMessage.unshift(msg);
  },
  changeIndexMessageCount({ indexMessage }, [chatType, chatId, count]) {
    const msg = indexMessage.find(item => {
      if (item.type !== chatType) return false;
      if (item.data.friend_cid && item.data.friend_cid === chatId) return true;
      if (item.data.gid && item.data.gid == chatId) return true;
      return false;
    });
    if (msg) msg.data.count = count;
  },
};
export default mutations;
