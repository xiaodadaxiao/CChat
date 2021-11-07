<template>
  <div class="container">
    <div class="succ">
      <van-icon name="passed" size="30vw" color="#ff6900" />
      <div class="succText">恭喜你注册成功！</div>
    </div>
    <div class="info">
      <div>您的唯一CID为：</div>
      <div class="cid">{{ cid }}</div>
      <div class="tips">请牢记您的CID，作为您的账号和好友联系枢纽</div>
    </div>
    <div class="login">
      <span>我已记住CID，去</span>
      <span class="goLogin" @click="goLogin">登录</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      cid: '',
    };
  },
  created() {
    const { cid } = this.$route.query;
    if (!cid) {
      return this.$router.push('/login');
    }

    this.cid = cid;
  },
  methods: {
    goLogin() {
      this.$router.push('/login?cid=' + this.cid);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  font-size: 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  box-sizing: border-box;
  text-align: center;
  padding: 0 5vw;
}
.succ {
  text-align: center;
  .succText {
    font-size: 8vw;
  }
}
.info {
  margin: 5vh 0;
  .cid {
    font-size: 20vw;
    color: @app-color;
  }
  .tips {
    color: #999;
    font-size: 4vw;
  }
}
.login {
  .goLogin {
    color: @app-color;
    border-bottom: 1px solid @app-color;
  }
}
</style>
