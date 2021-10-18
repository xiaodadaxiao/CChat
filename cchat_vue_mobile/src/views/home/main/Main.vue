<template>
  <div class="main-container">
    <router-view></router-view>
    <van-tabbar route active-color="#ff6900" inactive-color="#000" class="tarbar">
      <van-tabbar-item icon="chat-o" :badge="msgCount" to="/home/main/index">首页</van-tabbar-item>
      <van-tabbar-item
        icon="friends-o"
        :badge="friendApplyList.length > 0 ? friendApplyList.length : ''"
        to="/home/main/friendslist"
        >联系人</van-tabbar-item
      >
      <van-tabbar-item icon="fire-o" to="/home/main/other">动态</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getApplyList } from '@/network/friend';
export default {
  props: {},
  data() {
    return {
      msgCount: 1,
    };
  },
  async mounted() {
    //请求申请列表到vuex
    try {
      const res = await getApplyList();
      if (res.status !== 200) throw new Error();
      this.$store.commit('useFriendApplyList', res.data);
    } catch (error) {
      console.log(error);
      this.$toast.fail('请求好友申请列表失败');
    }
  },
  computed: {
    ...mapState(['friendApplyList']),
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
