<template>
  <div class="main-container">
    <router-view></router-view>
    <van-tabbar
      :route="true"
      active-color="#ff6900"
      inactive-color="#000"
      class="tarbar"
    >
      <van-tabbar-item icon="chat-o" :badge="msgCount" to="/home/main/index"
        >首页</van-tabbar-item
      >
      <van-tabbar-item icon="friends-o" :badge="2" to="/home/main/friendslist"
        >联系人</van-tabbar-item
      >
      <van-tabbar-item icon="fire-o" to="/home/main/other"
        >动态</van-tabbar-item
      >
    </van-tabbar>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      activeIndex: 0,
      msgCount: 1,
    };
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
  padding-bottom: 120rem; //和tabbar高度相同
}
.tarbar {
}
</style>
