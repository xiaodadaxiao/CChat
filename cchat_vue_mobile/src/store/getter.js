const getters = {
  //申请总数
  getApplyListCount(state) {
    return state.friendApplyList.length + state.groupApplyList.length;
  },
  //消息总数
  getIndexCount({ indexMessage }) {
    let count = 0;
    indexMessage.forEach(m => {
      count += m.data.count;
    });
    return count;
  },
};
export default getters;
