<template>
  <div class="login-container">
    <div class="logo">
      <van-image class="img" :src="require('@/assets/img/logo.png')"></van-image>
    </div>

    <div class="inputBox">
      <van-form ref="form">
        <van-field
          v-model="cid"
          type="number"
          name="cid"
          placeholder="CID"
          left-icon="manager-o"
          clearable
          :rules="[{ required: true, message: '请填写CID' }]"
        />
        <van-field
          v-model="password"
          left-icon="shield-o"
          placeholder="输入密码"
          type="password"
          name="password"
          clearable
          @keyup.enter.native="loginClick"
          :rules="[{ pattern: passwordExp, message: '密码至少包含6位数字和英文' }]"
        />

        <div>
          <van-button round block :disabled="disBtn" :loading="btnIsLoading" color="#ff6900" native-type="button" @click="loginClick">登录</van-button>
        </div>
      </van-form>
    </div>
    <div class="other">
      <a href="">忘记密码?</a>
      <a href="/register">注册CID</a>
    </div>
  </div>
</template>

<script>
import { login } from '@/network/login';
export default {
  props: {},
  data() {
    return {
      cid: '',
      password: '',
      passwordExp: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
      disBtn: false, //按钮是否可点击
      btnIsLoading: false,
    };
  },
  created() {
    const { cid } = this.$route.query;
    if (cid) this.cid = cid;
  },
  methods: {
    async loginClick() {
      try {
        await this.$refs.form.validate();
        //发送请求
        this.btnIsLoading = true;
        this.disBtn = true;
        const res = await login(this.cid, this.password);
        this.btnIsLoading = false;
        this.disBtn = false;
        if (res.status === 200) {
          this.$toast.success('登录成功');
          localStorage.setItem('token', res.token);
          console.log(res);
          this.$store.commit('useIsLogin', { flag: true, cid: res.cid });
          //跳转首页
          this.$router.replace('/home');
        } else {
          this.$toast.fail(res.message);
        }
      } catch (err) {
        console.log(err);
        this.$toast.fail('错误');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.logo {
  margin-top: 5vh;
  text-align: center;
  height: 200px;
  .img {
    height: 100%;
  }
}
.inputBox {
  margin: 5vh 5vw;
  padding: 2vh 5vw;
}

.other {
  margin-top: 2vw;
  font-size: 4vw;
  display: flex;
  justify-content: space-between;
  padding: 0 10vw;
  & > a {
    color: #999;
  }
}
</style>
