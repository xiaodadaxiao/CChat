<template>
  <div class="main-container">
    <router-view></router-view>
    <van-tabbar route active-color="#ff6900" inactive-color="#000" class="tarbar">
      <van-tabbar-item icon="chat-o" :badge="msgCount" to="/home/main/index">首页</van-tabbar-item>
      <van-tabbar-item icon="friends-o" :badge="getApplyListCount > 0 ? getApplyListCount : ''" to="/home/main/friendslist"
        >联系人</van-tabbar-item
      >
      <van-tabbar-item icon="fire-o" to="/home/main/other">动态</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {},
  data() {
    return {
      msgCount: 1,
    };
  },
  async mounted() {
    this.$store.dispatch('requestFriendApplyList');
    this.$store.dispatch('requestGroupApplyList');
  },
  computed: {
    ...mapGetters(['getApplyListCount']),
  },
  methods: {},
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
