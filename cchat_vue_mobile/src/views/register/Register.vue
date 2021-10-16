<template>
  <div class="container">
    <div class="title">注册CID</div>
    <div class="inputBox">
      <van-form validate-first :submit-on-enter="false" ref="form">
        <!-- 邮箱 -->
        <van-field
          v-model="email"
          left-icon="envelop-o"
          placeholder="注册邮箱地址"
          name="email"
          clearable
          :rules="[{ pattern: emailExp, message: '请输入正确邮箱地址' }]"
          class="input"
        />
        <!--发送验证码 -->
        <van-field
          v-model="code"
          center
          clearable
          name="code"
          placeholder="请输入验证码"
          left-icon="chat-o"
          :rules="[{ required: true, message: '验证码不能为空' }]"
        >
          <template #button>
            <van-count-down
              :time="time"
              v-show="isShowCountDown"
              @finish="countDownFinish"
            />
            <van-button
              size="small"
              type="info"
              native-type="button"
              @click="sendCode"
              :disabled="disCodeBtn"
              :loading="sendIsLoading"
              loading-text="发送中..."
              >{{ sendCodeBtnText }}</van-button
            >
          </template>
        </van-field>
        <!-- 密码框 -->
        <van-field
          v-model="password"
          left-icon="shield-o"
          placeholder="输入密码"
          type="password"
          name="password"
          clearable
          :rules="[
            { pattern: passwordExp, message: '密码至少包含6位数字和英文' },
          ]"
        />
        <!-- 二次密码 -->
        <van-field
          v-model="password2"
          left-icon="shield-o"
          placeholder="再次输入密码"
          type="password"
          name="password2"
          clearable
          :rules="[
            {
              validator: validatorPassword,
              required: true,
              message: '两次密码输入不一致',
            },
          ]"
        />
      </van-form>
      <van-button
        size="normal"
        class="regiBtn"
        block
        round
        :loading="registerIsLoading"
        :disabled="disRegiterBtn"
        color="linear-gradient(to right, #ff416c, #ff4b2b)"
        @click="registerClick"
        >注册</van-button
      >
    </div>
    <div class="login">
      <span>已有CID账号?去</span>
      <a class="goLogin" href="/login">登录</a>
    </div>
  </div>
</template>

<script>
//网络请求
import { sendCode, register } from "@/network/register";
export default {
  data() {
    return {
      email: "",
      code: "",
      password: "",
      password2: "",
      emailExp: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      passwordExp: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
      disCodeBtn: false, //是否能点击发送验证码
      sendIsLoading: false, //验证按钮loading
      disRegiterBtn: false, //是否能点击注册按钮
      registerIsLoading: false, //注册按钮是否能loading
      sendCodeBtnText: "发送验证码",
      isShowCountDown: false,
      time: 0, //发送验证码倒计时
    };
  },
  methods: {
    validatorPassword(val) {
      return val === this.password;
    },
    //点击发送验证码
    async sendCode() {
      try {
        await this.$refs.form.validate("email");
        //发送请求
        this.sendIsLoading = true;
        const res = await sendCode(this.email);
        this.sendIsLoading = false;
        if (res.status === 200 || res.status === 202) {
          this.$toast.success("发送成功");
          this.sendCodeBtnText = "已发送";
          this.isShowCountDown = true;
          this.disCodeBtn = true;
          //计算倒计时
          this.time = new Date(res.endTime).getTime() - Date.now();
          return;
        }
        if (res.status === 201) {
          this.$toast.fail("该邮箱用户已存在");
          return;
        }
        throw new Error();
      } catch (error) {
        this.sendIsLoading = false;
        this.$toast.fail("发送错误");
        console.log(error);
      }
    },
    //倒计时结束
    countDownFinish() {
      this.disCodeBtn = false; //是否能点击发送验证码
      this.sendCodeBtnText = "发送验证码";
      this.isShowCountDown = false;
    },
    //点击注册
    async registerClick() {
      try {
        //校验表单
        await this.$refs.form.validate();
        //发送请求
        this.disRegiterBtn = true;
        this.registerIsLoading = true;
        const res = await register(this.email, this.code, this.password);
        this.disRegiterBtn = false;
        this.registerIsLoading = false;
        if (res.status === 200) {
          this.$toast.success("注册成功");
          const { cid, name, email } = res;
          this.$router.replace({
            path: "/register_success",
            query: { cid, name, email },
          });
        } else {
          return this.$toast.fail(res.message);
        }
      } catch (err) {
        this.disRegiterBtn = false;
        this.registerIsLoading = false;
        console.log(err);
      }
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  color: @app-color;
  font-weight: bold;
  font-size: 10vw;
  padding-bottom: 5vh;
}
.login {
  margin-top: 5vh;
  font-size: 4vw;
  color: #999;
  .goLogin {
    border-bottom: 1px solid @app-color;
    color: @app-color;
  }
}
</style>
