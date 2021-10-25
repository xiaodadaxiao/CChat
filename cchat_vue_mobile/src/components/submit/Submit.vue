<template>
  <div class="submit-container">
    <!-- 输入框 -->
    <div class="submit">
      <van-icon name="more-o" size="34" @click="changeInput" />
      <textarea rows="1" placeholder="输入信息" class="input" @focus="onFocus" @blur="onBlur" v-show="isShowInput" />
      <div v-show="!isShowInput" class="input microphone">按住 说话</div>
      <van-icon name="smile-o" size="34" />
      <van-icon name="add-o" size="34" v-show="!isInputing" />
      <van-button v-show="isInputing" type="primary" size="small">发送</van-button>
    </div>
    <!-- 表情区-->
    <!-- 操作区 -->
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      value: '',
      inputBottom: 0,
      isInputing: false,
      isShowInput: true, //语音和输入框切换
    };
  },
  methods: {
    //获得焦点
    onFocus() {
      this.isInputing = true;
    },
    //失去焦点
    onBlur() {
      this.isInputing = false;
    },
    //切换输入模式
    changeInput() {
      this.isShowInput = !this.isShowInput;
    },
  },
};
</script>

<style lang="less" scoped>
.submit-container {
  .submit {
    display: flex;
    flex-direction: row;
    padding: 3vw 2vw;
    .input {
      flex: 1;
      margin: 0 1vw;
    }
    .microphone {
      text-align: center;
      background-color: #fff;
      line-height: 2;
    }
  }
}
</style>
