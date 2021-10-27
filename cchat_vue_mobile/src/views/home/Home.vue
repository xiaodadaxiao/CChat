<template>
  <div class="home">
    <router-view></router-view>
  </div>
</template>

<script>
import * as errorTypes from '@/constant/error';
export default {
  props: {},
  data() {
    return {};
  },
  mounted() {},
  sockets: {
    connect_error(err) {
      console.log(err);
      const message = {
        [errorTypes.ONLINE]: '该账号已登录在线，不能重复登录！如果密码被泄露请马上修改密码',
        [errorTypes.NOT_TOKEN]: '没有token！请重新登录！',
        [errorTypes.TOKEN_INVALID]: 'token校验失效，请重新登录！',
      };
      if (message[err.message]) {
        this.$dialog.alert({
          message: message[err.message],
        });
        this.$router.replace('/login');
      } else {
        this.$dialog.alert({
          message: '连接聊天服务器失败',
        });
      }
    },
    connect() {
      this.$toast.success('连接聊天服务器成功');
    },
    nologin() {
      this.$dialog.alert({
        message: '没有登录，请登录',
      });
      this.$router.replace('/login');
    },
  },
  async created() {
    /* 建立连接 */
    this.$socket.io.opts.query.token = localStorage.getItem('token');
    this.$socket.open();
  },
  mounted() {
    this.$store.dispatch('requestFriendApplyList');
    this.$store.dispatch('requestGroupApplyList');
    this.$store.dispatch('requestIndexMessage');
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
  background-color: @app-bgc;
}
</style>
