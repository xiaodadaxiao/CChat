<template>
  <div class="index-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="CChat" fixed @click-left="leftCick" @click-right="rightClick"> </van-nav-bar>
    <!-- 聊天列表 可刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="freshbox">
      <!-- 网络错误提示栏 -->
      <van-notice-bar color="red" background="#ecf9ff" left-icon="info" v-show="isConnectError">
        网络连接失败
      </van-notice-bar>
      <van-empty description="暂无聊天信息" class="freshbox" v-if="indexMessage.length == 0" />
      <div class="chatlist" v-else>
        <!-- 单个聊天 -->
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
                  {{ getShowValue(item.data.content, item.data.type) }}
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
              <van-button square text="删除" type="danger" @click="deleteMessage(item.type, item.data.friend_cid)" class="delete-button" />
            </template>
          </van-swipe-cell>
          <!-- 群 -->
          <van-swipe-cell v-else-if="item.type === 'group'">
            <div class="chatitem" @click="goChat(item.type, item.data.gid)">
              <!-- 群头像 -->
              <van-image round :src="item.data.avatar_url" class="img" />
              <!-- 群名称和聊天内容 -->
              <div class="message">
                <div class="name show-one-row">{{ item.data.gname }}</div>
                <div class="value show-one-row">
                  {{
                    `
                    ${item.data.remind == groupType.REMIND_NOT_DISTURB && item.data.count > 0 ? '[' + item.data.count + '条]' : ''}
                    ${item.data.nickname ? item.data.nickname : item.data.name}:${getShowValue(item.data.content, item.data.type)}`
                  }}
                </div>
              </div>
              <!-- 群最后聊天时间 -->
              <div class="right">
                <div class="time">{{ item.data.updateAt | dateFormat }}</div>
                <van-badge
                  v-if="item.data.remind == groupType.REMIND_NORMAL"
                  color="#ff6900"
                  :content="item.data.count > 0 ? item.data.count : ''"
                  class="count"
                  :max="99"
                />
                <van-icon v-else :name="require('@/assets/img/no-remind.png')" />
              </div>
            </div>
            <!-- 右滑操作 -->
            <template #right>
              <van-button square text="删除" type="danger" @click="deleteMessage(item.type, item.data.gid)" class="delete-button" />
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import * as messageType from '@/constant/message';
import * as groupType from '@/constant/group';
import { deleteGroupMessage, deleteFriendMessage } from '@/network/message';
export default {
  props: {},
  data() {
    return {
      messageType,
      groupType,
      count: 10,
      isLoading: false,
    };
  },
  methods: {
    onRefresh() {
      //下拉刷新
      this.$store.dispatch('requestIndexMessage');
      this.$store.dispatch('requestFriendApplyList');
      this.$store.dispatch('requestGroupApplyList');
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
    //得到要展示的内容
    getShowValue(content, type) {
      switch (type) {
        case this.messageType.TEXT:
          return content;
        case this.messageType.IMAGE:
          return '[图片]';
        case this.messageType.LOCATION:
          return '[位置]';
        default:
          return content;
      }
    },
    //右滑删除聊天
    async deleteMessage(type, id) {
      try {
        if (type == this.messageType.CHAT_FRIEND) {
          const res = await deleteFriendMessage(id);
          if (res.status !== 200) return this.$toast.fail('删除失败');
        }
        if (type == this.messageType.CHAT_GROUP) {
          const res = await deleteGroupMessage(id);
          if (res.status !== 200) return this.$toast.fail('删除失败');
        }
        // vuex删除数据
        this.$store.commit('removeOneIndexMessage', [type, id]);
      } catch (error) {
        console.log(error);
        this.$toast.fail('删除失败');
      }
    },
  },
  sockets: {
    test(info) {
      console.log('index test', info);
    },
  },
  computed: {
    ...mapState(['indexMessage', 'isConnectError']),
  },
  watch: {
    indexMessage() {
      console.log('indexMessage发生变化');
      this.isLoading = false;
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
