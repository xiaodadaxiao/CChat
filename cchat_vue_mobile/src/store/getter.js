import * as messageType from '@/constant/message';
import * as groupType from '@/constant/group';
const getters = {
  //申请总数
  getApplyListCount(state) {
    return state.friendApplyList.length + state.groupApplyList.length;
  },
  //消息总数
  getIndexCount({ indexMessage }) {
    let count = 0;
    indexMessage.forEach(m => {
      //群免打扰
      if (m.type == messageType.CHAT_GROUP && m.data.remind == groupType.REMIND_NOT_DISTURB) return;
      count += m.data.count;
    });
    return count;
  },
};
export default getters;
