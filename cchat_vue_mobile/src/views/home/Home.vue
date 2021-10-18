<template>
  <div class="home">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  async created() {
    /* 建立连接 */
    //this.$socket.open();
  },
  destroyed() {
    /* 断开连接 */
    this.$socket.close();
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.home {
  // font-size: 5vw;
  background-color: @app-bgc;
}
</style>
