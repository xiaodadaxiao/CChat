<template>
  <div class="main-container">
    <router-view></router-view>
    <van-tabbar route active-color="#ff6900" inactive-color="#000" class="tarbar">
      <van-tabbar-item icon="chat-o" :badge="getIndexCount > 0 ? getIndexCount : ''" to="/home/main/index">首页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" :badge="getApplyListCount > 0 ? getApplyListCount : ''" to="/home/main/friendslist"
        >联系人</van-tabbar-item
      >
      <van-tabbar-item icon="fire-o" to="/home/main/other">动态</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import * as messageType from '@/constant/message';
export default {
  props: {},
  data() {
    return {
      messageType,
    };
  },
  async mounted() {
    this.$store.dispatch('requestFriendApplyList');
    this.$store.dispatch('requestGroupApplyList');
    this.$store.dispatch('requestIndexMessage');
  },
  computed: {
    ...mapGetters(['getApplyListCount', 'getIndexCount']),
    ...mapState(['indexMessage']),
  },
  methods: {},
  sockets: {
    friendMessage(data) {
      let i;
      const friendMsg = this.indexMessage.find((item, index) => {
        i = index;
        return item.type == this.messageType.CHAT_FRIEND && item.data.friend_cid == data.talker_cid;
      });

      if (!friendMsg) {
        this.$store.dispatch('requestIndexMessage');
      } else {
        //改变数值
        friendMsg.data.content = data.content;
        friendMsg.data.updateAt = data.updateAt;
        friendMsg.data.type = data.type;
        friendMsg.data.count++;
        //置顶
        this.indexMessage.splice(i, 1);
        this.indexMessage.unshift(friendMsg);
        this.$store.commit('useIndexMessage', this.indexMessage);
      }
    },
    groupMessage(data) {
      let i;
      const groupMsg = this.indexMessage.find((item, index) => {
        i = index;
        return item.type == this.messageType.CHAT_GROUP && item.data.gid == data.gid;
      });
      if (!groupMsg) {
        this.$store.dispatch('requestIndexMessage');
      } else {
        //改变数值
        groupMsg.data.content = data.content;
        groupMsg.data.nickname = data.nickname;
        groupMsg.data.updateAt = data.updateAt;
        groupMsg.data.type = data.type;
        groupMsg.data.count++;
        //置顶
        this.indexMessage.splice(i, 1);
        this.indexMessage.unshift(groupMsg);
        this.$store.commit('useIndexMessage', this.indexMessage);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 50px; //和tabbar高度相同
}
</style>
