<template>
  <div class="index-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="CChat" fixed left-arrow @click-left="leftCick" @click-right="rightClick">
      <template #left>
        <van-image width="37" height="37" src="https://img01.yzcdn.cn/vant/cat.jpeg" />
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
        <div v-for="item in indexMessage" :key="item.type == 'group' ? item.data.gid : item.data.friend_cid">
          <!-- 好友 -->
          <van-swipe-cell v-if="item.type === 'friend'">
            <div class="chatitem" @click="goChat(item.type, item.data.friend_cid)">
              <!-- 好友头像 -->
              <van-image round :src="item.data.avatar_url" class="img" />
              <!-- 好友名称和聊天内容 -->
              <div class="message">
                <div class="name show-one-row">{{ item.data.nickname }}</div>
                <div class="value show-one-row">
                  {{ item.data.content }}
                </div>
              </div>
              <!-- 最后聊天时间 -->
              <div class="right">
                <div class="time">{{ item.data.updateAt | dateFormat }}</div>
                <van-badge color="#ff6900" :content="item.data.count > 0 ? item.data.count : ''" class="count" :max="10" />
              </div>
            </div>
            <!-- 右滑操作 -->
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" />
            </template>
          </van-swipe-cell>
          <van-swipe-cell v-else-if="item.type === 'group'">
            <div class="chatitem" @click="goChat(item.type, item.data.gid)">
              <!-- 群头像 -->
              <van-image round :src="item.data.avatar_url" class="img" />
              <!-- 群名称和聊天内容 -->
              <div class="message">
                <div class="name show-one-row">{{ item.data.gname }}</div>
                <div class="value show-one-row">
                  {{ `${item.data.talker_name}:${item.data.content}` }}
                </div>
              </div>
              <!-- 群最后聊天时间 -->
              <div class="right">
                <div class="time">{{ item.data.updateAt | dateFormat }}</div>
                <van-badge color="#ff6900" :content="item.data.count > 0 ? item.data.count : ''" class="count" :max="10" />
              </div>
            </div>
            <!-- 右滑操作 -->
            <template #right>
              <van-button square text="删除" type="danger" class="delete-button" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
    goChat(type, id) {
      this.$router.push(`/home/chat/${type}/${id}`);
    },
    leftCick() {
      console.log('左侧点击');
    },
    rightClick() {
      console.log('右侧点击');
    },
  },
  sockets: {
    test(info) {
      console.log('index', info);
    },
  },
  computed: {
    ...mapState(['indexMessage']),
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
    margin-top: 1vw;
  }
  .message {
    height: 8vh;
    flex: 1;
    padding-left: 3vw;
    display: flex;
    flex-direction: column;
    .name {
      font-size: 4.5vw;
      height: 4.5vh;
      line-height: 4.5vh;
      font-weight: 500;
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
    align-items: center;
    .time {
      height: 3vh;
      line-height: 3vh;
      width: 18vw;
      color: #999;
      font-size: 3.5vw;
      text-align: center;
    }
    .count {
      width: 7vw;
      height: 7vw;
      border-radius: 50%;
      text-align: center;
      line-height: 7vw;
    }

    font-size: 4vw;
  }
}
//右边滑动操作栏

.delete-button {
  height: 100%;
}
</style>
