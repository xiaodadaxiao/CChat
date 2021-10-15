<template>
  <div class="index-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="CChat"
      fixed
      left-arrow
      @click-left="leftCick"
      @click-right="rightClick"
    >
      <template #left>
        <van-image
          width="40"
          height="40"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        />
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
            <van-image
              round
              src="https://img01.yzcdn.cn/vant/cat.jpeg"
              class="img"
            />
            <!-- 好友名称和聊天内容 -->
            <div class="message">
              <div class="name">刘德华</div>
              <div class="value">
                我是刘德华，很高兴见到你，因为实打实的阿三大苏打
              </div>
            </div>
            <!-- 最后聊天时间 -->
            <div class="right">
              <div class="time">11:45</div>
              <van-badge
                color="#ff6900"
                :content="20"
                class="count"
                :max="10"
              />
            </div>
          </div>
          <!-- 右滑操作 -->
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
            />
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
      console.log("下拉刷新");
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    leftCick() {
      console.log("左侧点击");
    },
    rightClick() {
      console.log("右侧点击");
    },
  },
};
</script>

<style lang="less" scoped>
.index-container {
  padding-top: 100rem;
}

.freshbox {
  height: calc(100vh - 100rem - 120rem);
  overflow: auto;
}
//单个好友聊天内容
.chatitem {
  display: flex;
  justify-content: space-between;
  height: 140rem;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  padding: 5rem 0;
  & > div {
    height: 100%;
  }
  //好友头像
  .img {
    width: 130rem;
    height: 130rem;
    border-radius: 12rem;
  }
  .message {
    flex: 1;
    & > div {
      box-sizing: border-box;
      padding: 5rem 10rem;
    }
    .name {
      font-size: 40rem;
      line-height: 80rem;
      height: 80rem;
    }
    .value {
      line-height: 50rem;
      height: 50rem;
      color: #999;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-wrap: break-word;
      white-space: normal !important;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100rem;
    .time {
      height: 30rem;
      color: #999;
      // line-height: 100rem;
    }
    .count {
      // border-color: @app-bgc;
    }

    font-size: 30rem;
  }
}
//右边滑动操作栏

.delete-button {
  height: 100%;
}
</style>
