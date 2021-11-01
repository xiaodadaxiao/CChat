<template>
  <div class="submit-container" ref="submitRef">
    <!-- 输入框 -->
    <div class="submit">
      <!-- 切换语音文字输入 -->
      <van-icon name="more-o" size="34" @click="isShowInput = !isShowInput" />
      <textarea v-model.trim="inputValue" rows="1" placeholder="输入信息" class="input" v-show="isShowInput" />
      <div v-show="!isShowInput" class="input microphone">按住 说话</div>
      <!-- 表情 -->
      <van-icon name="smile-o" size="34" :style="{ color: isShowEmjoi ? '#ff6900' : 'black' }" @click="clickShowEmjoi" />
      <!-- +号 -->
      <van-icon
        name="add-o"
        size="34"
        v-show="!isShowBtn"
        :style="{ color: isShowMore ? '#ff6900' : 'black' }"
        @click="clickShowMore"
      />
      <van-button v-show="isShowBtn" type="primary" size="small" @click="send">发送</van-button>
    </div>
    <!-- 表情区-->
    <div class="emjoi" v-show="isShowEmjoi">
      <div v-for="(e, i) in emjoiList" :key="i" @click="inputValue += e">{{ e }}</div>
    </div>

    <!-- 操作区 -->
    <div class="more" v-show="isShowMore">
      <van-uploader accept="image/*" :after-read="afterReadImage">
        <div class="more-item">
          <img :src="require('@/assets/img/image.png')" />
          <div>图片</div>
        </div>
      </van-uploader>
      <div class="more-item">
        <img :src="require('@/assets/img/position.png')" />
        <div>位置</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as messageType from '@/constant/message';
import emjoiList from './emjoiData';
import { uploadImage } from '@/network/file';
export default {
  props: {},
  data() {
    return {
      inputValue: '',
      isShowBtn: false,
      isShowInput: true, //语音和输入框切换
      isShowEmjoi: false, //切换展示表情
      isShowMore: false,
      emjoiList,
    };
  },
  mounted() {},
  methods: {
    //计算元素高度
    getHeight() {
      const height = this.$refs.submitRef.offsetHeight;
      this.$emit('heightChange', height);
    },
    //点击切换展示表情
    clickShowEmjoi() {
      this.isShowMore = false;
      this.isShowEmjoi = !this.isShowEmjoi;
      //计算高度
      this.$nextTick(this.getHeight);
    },
    //点击切换更多
    clickShowMore() {
      this.isShowEmjoi = false;
      this.isShowMore = !this.isShowMore;
      //计算高度
      this.$nextTick(this.getHeight);
    },
    //上传图片
    async afterReadImage(file) {
      if (file.file.size > 5 * 1024 * 1024) return this.$toast.fail('图片不能超过5M！');
      try {
        const formData = new FormData();
        formData.append('image', file.file);
        const res = await uploadImage(formData);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$emit('send', messageType.IMAGE, res.url);
      } catch (error) {
        console.log(error);
        this.$toast.fail('发生错误');
      }
    },

    //发送
    send() {
      this.$emit('send', messageType.TEXT, this.inputValue);
      this.inputValue = '';
    },
  },
  watch: {
    inputValue() {
      this.isShowBtn = this.inputValue.length > 0;
    },
  },
};
</script>

<style lang="less" scoped>
.submit-container {
  //输入栏
  .submit {
    display: flex;
    flex-direction: row;
    padding: 3vw 2vw;
    background-color: #e1e1e1;
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
  //表情栏
  .emjoi {
    width: 100vw;
    height: 20vh;
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    padding: 5vw;
    box-sizing: border-box;
    & > div {
      width: 15vw;
      height: 15vw;
      text-align: center;
      font-size: 7vw;
      line-height: 15vw;
    }
  }
  //更多操作区
  .more {
    width: 100vw;
    height: 20vh;
    display: flex;
    overflow: scroll;
    .more-item {
      width: 25vw;
      height: 15vh;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 50%;
        margin-bottom: 1vw;
      }
    }
  }
}
</style>
