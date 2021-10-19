<template>
  <div class="index-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="CChat" fixed left-arrow @click-left="leftCick" @click-right="rightClick">
      <template #left>
        <van-image width="40" height="40" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
      </template>
      <!-- 头部右侧 -->
      <template #right>
        <van-icon name="plus" size="18" />
      </template>
    </van-nav-bar>
    <!-- 聊天列表 可刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="freshbox">
      <div class="chatlist">
        <!-- 好友 -->
        <van-swipe-cell v-for="(ittem, index) in 10">
          <div class="chatitem">
            <!-- 好友头像 -->
            <van-image round src="https://img01.yzcdn.cn/vant/cat.jpeg" class="img" />
            <!-- 好友名称和聊天内容 -->
            <div class="message">
              <div class="name">刘德华</div>
              <div class="value show-one-row">
                我是刘德华，很高兴见到你，因为实打实的阿三大苏打
              </div>
            </div>
            <!-- 最后聊天时间 -->
            <div class="right">
              <div class="time">11:45</div>
              <van-badge color="#ff6900" :content="20" class="count" :max="10" />
            </div>
          </div>
          <!-- 右滑操作 -->
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button" />
          </template>
        </van-swipe-cell>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      count: 10,
      isLoading: false,
    };
  },
  methods: {
    onRefresh() {
      console.log('下拉刷新');
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    leftCick() {
      console.log('左侧点击');
    },
    rightClick() {
      console.log('右侧点击');
    },
  },
};
</script>

<style lang="less" scoped>
.index-container {
  padding-top: 46px; //navbar高度
}

.freshbox {
  height: calc(100vh - 50px - 46px); //100vh-tabbar高度-navbar高度
  overflow: auto;
}
//单个好友聊天内容
.chatitem {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 1vh 1vw;
  //底部边框线
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: -2px;
    width: 87vw;
    height: 0.6px;
    background-color: @border-c;
  }
  //好友头像
  .img {
    width: 12vw;
    height: 12vw;
    border-radius: 1.5vw;
  }
  .message {
    height: 8vh;
    flex: 1;
    padding: 0 1vw;
    display: flex;
    flex-direction: column;
    .name {
      font-size: 4.5vw;
      height: 4.5vh;
      line-height: 4.5vh;
    }
    .value {
      height: 3vh;
      line-height: 3vh;
      color: @info-c;
      font-size: 4vw;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .time {
      height: 3vh;
      line-height: 3vh;

      width: 10vw;
      color: #999;
    }
    .count {
      // border-color: @app-bgc;
      padding: 0.1vh;
    }

    font-size: 4vw;
  }
}
//右边滑动操作栏

.delete-button {
  height: 100%;
}
</style>
