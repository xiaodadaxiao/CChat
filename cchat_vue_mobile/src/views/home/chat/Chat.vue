<template>
  <div class="chat-container">
    <van-nav-bar
      :title="chatType == 'friend' ? friendInfo.nickname : groupInfo.gname"
      left-text="返回"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="goInfo(chatType, chatId)"
    >
      <template #right>
        <van-icon name="wap-nav" size="20" color="#ff6900" />
      </template>
    </van-nav-bar>
    <div class="main" :style="{ 'padding-bottom': bottomHeight + 'px' }">
      <van-list
        v-model="loading"
        :finished="finished"
        direction="up"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="5"
        class="chat-list"
      >
        <div v-for="item in chatType == 'friend' ? friendMessage : groupMessage" :key="item.id">
          <!-- 发言 -->
          <div :class="userCid !== item.talker_cid ? 'chat-item chat-item-l' : 'chat-item chat-item-r'">
            <!-- 时间 -->
            <div class="time">{{ item.showTime | chatDateFormat }}</div>
            <!-- [提示内容] -->
            <div class="tips-main" v-if="item.type == messageType.TIPS">
              {{ item.content }}
            </div>
            <!-- [对话内容] -->
            <div class="msg-main" v-else>
              <!-- 头像 -->
              <div class="avatar">
                <van-image width="45" class="avatar-img" height="45" @click="goInfo('user', item.talker_cid)" :src="item.avatar_url" />
              </div>
              <!-- 名字和内容 -->
              <div class="info">
                <!-- 群用户且在左侧 才显示名字 -->
                <div class="name show-one-row" v-if="chatType == 'group' && userCid !== item.talker_cid">
                  {{ item.nickname ? item.nickname : item.name }}
                </div>
                <div class="value">
                  <!-- 文本 -->
                  <div class="message" v-if="item.type == messageType.TEXT">
                    {{ item.content }}
                  </div>
                  <!-- 图片 -->
                  <!-- <van-image
                    fit="scale-down"
                    @click="clickImg(item.content)"
                    v-if="item.type == messageType.IMAGE"
                    :src="item.content"
                    class="img"
                    show-error
                    lazy-load
                  /> -->
                  <img @click="clickImg(item.content)" v-if="item.type == messageType.IMAGE" :src="item.content" class="img" alt="图片加载失败" />
                  <!-- 定位 -->
                  <map-message v-if="item.type == messageType.LOCATION" :centerStr="item.content" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 操作栏 -->
    <submit class="submit" @heightChange="submitHeightChange" @send="sendMessage" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
//展示图片函数
import { ImagePreview } from 'vant';
import { searchGroup } from '@/network/group';
import { getFriendInfo } from '@/network/friend';
import { getFriendMessage, getGroupMessage } from '@/network/message';
import { handleChatDate, chatDateFormat } from '@/utils/filter';
import * as messageType from '@/constant/message';
import Submit from '@/components/submit/Submit';
import MapMessage from '@/components/mapMessage/MapMessage';
export default {
  props: {},
  data() {
    return {
      chatType: '',
      chatId: '',
      messageType,
      loading: false,
      finished: false, //是否全部加载完成
      friendInfo: {},
      groupInfo: {},
      friendMessage: [],
      groupMessage: [],
      page: 1,
      scrollDiv: '',
      bottomHeight: 56, //底部高度
    };
  },
  components: { Submit, 'map-message': MapMessage },
  async created() {
    const { type, id } = this.$route.params;
    this.chatType = type;
    this.chatId = id;
    try {
      /* 请求数据 */
      if (this.chatType == 'friend') {
        //请求好友数据
        const res = await getFriendInfo(this.chatId);
        if (res.status !== 200) return this.$toast.fail(res.messag);
        this.friendInfo = res.friendInfo;
      }
      if (this.chatType == 'group') {
        const res = await searchGroup(this.chatId);
        if (res.status !== 200) return this.$toast.fail(res.messag);
        this.groupInfo = res.groupInfo;
      }
      /* 更新最后聊天时间 */
      this.$socketEmit('lastTime', { chatType: this.chatType, chatId: this.chatId });
    } catch (error) {
      console.log(error);
      this.$toast.fail('请求数据错误');
    }
  },
  async mounted() {
    //请求聊天数据
    await this.init();

    //得到滑动区域
    this.scrollDiv = document.querySelector('.chat-list');
    //滑动到底部
    this.scroll();
  },
  beforeDestroy() {
    /* 更新最后聊天时间 */
    this.$socketEmit('lastTime', { chatType: this.chatType, chatId: this.chatId });
    /* 设置未读数为0 */
    this.$store.commit('changeIndexMessageCount', [this.chatType, this.chatId, 0]);
  },
  filters: {
    chatDateFormat,
  },
  methods: {
    async init() {
      //请求聊天数据
      try {
        if (this.chatType == 'friend') {
          const res = await getFriendMessage(this.chatId, this.friendMessage.length, this.page * 10);
          if (res.status !== 200) return this.$toast.fail(res.messag);
          this.friendMessage.push(...res.data);
          //设置为无可加载
          if (res.count <= this.friendMessage.length) this.finished = true;
          //排序
          this.friendMessage.sort((a, b) => new Date(a.updateAt) - new Date(b.updateAt));
        }
        if (this.chatType == 'group') {
          const res = await getGroupMessage(this.chatId, this.groupMessage.length, this.page * 10);
          if (res.status !== 200) return this.$toast.fail(res.messag);
          this.groupMessage.push(...res.data);
          //设置为无可加载
          if (res.count <= this.groupMessage.length) this.finished = true;
          //排序
          this.groupMessage.sort((a, b) => new Date(a.updateAt) - new Date(b.updateAt));
        }
        //处理时间
        this.handleTime();
      } catch (error) {
        console.log(error);
        this.$toast.fail('请求聊天数据错误');
      }
    },
    onClickLeft() {
      // this.$router.replace('/home/main');
      this.$router.go(-1);
    },
    goInfo(type, id) {
      if (type == this.messageType.CHAT_FRIEND) this.$router.push('/home/user/' + id);
      if (type == 'user') this.$router.push('/home/user/' + id);
      if (type == this.messageType.CHAT_GROUP) this.$router.push('/home/group/' + id);
    },
    //上拉加载
    async onLoad() {
      //记录当前位置(距离底部)
      const bottom = this.scrollDiv.scrollHeight - this.scrollDiv.scrollTop;
      await this.init();
      //滚动到当前位置
      this.scroll(bottom);
      //完成加载
      this.loading = false;
    },
    //输入栏高度变化
    submitHeightChange(h) {
      this.bottomHeight = h;
      //滑动到底部
      this.scroll();
    },
    //输入栏发送信息
    async sendMessage(type, value) {
      try {
        await this.$socketEmit('message', { content: value, chatId: this.chatId, chatType: this.chatType, type });
        //添加本地数据
      } catch (error) {
        this.$dialog.alert({ message: error });
      }
    },
    //点击预览图片
    clickImg(url) {
      ImagePreview([url]);
    },
    //滚动(距离底部高度)
    scroll(bottom = 0) {
      this.$nextTick(() => {
        this.scrollDiv.scrollTop = this.scrollDiv.scrollHeight - bottom;
      });
    },
    //处理时间
    handleTime() {
      //好友时间
      for (let i = this.friendMessage.length - 1; i >= 0; i--) {
        let m = this.friendMessage[i];
        if (i == 0) {
          m.showTime = handleChatDate(m.updateAt, null);
        } else {
          m.showTime = handleChatDate(m.updateAt, this.friendMessage[i - 1].updateAt);
        }
      }
      //群时间
      for (let i = this.groupMessage.length - 1; i >= 0; i--) {
        let m = this.groupMessage[i];
        if (i == 0) {
          m.showTime = handleChatDate(m.updateAt, null);
        } else {
          m.showTime = handleChatDate(m.updateAt, this.groupMessage[i - 1].updateAt);
        }
      }
    },
  },
  computed: {
    ...mapState(['userCid']),
  },
  sockets: {
    //接收好友信息
    friendMessage(data) {
      if (data.talker_cid == this.chatId || data.talker_cid == this.userCid) {
        this.friendMessage.push(data);
        //滑动到底部
        this.scroll();
        //处理时间
        this.handleTime();
      }
    },
    groupMessage(data) {
      if (data.chatId == this.chatId) {
        this.groupMessage.push(data);
        //滑动到底部
        this.scroll();
        //处理时间
        this.handleTime();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.chat-container {
  background-color: #ededed;
}
.main {
  height: 100vh;
  box-sizing: border-box;
  padding-top: 46px;
  .chat-list {
    height: 100%;
    overflow: scroll;
    padding: 0 2vw;
    //提示文本
    .tips-main {
      color: @info-c;
      text-align: center;
      font-size: 4vw;
      margin-bottom: 3vh;
    }
    // 单个聊天发言(公共)
    .chat-item {
      //时间
      .time {
        text-align: center;
        color: @info-c;
        padding: 2vh 0;
      }
      //main（公共）
      .msg-main {
        display: flex;
        margin-bottom: 1vh;
        .avatar {
          .avatar-img {
            box-shadow: 0.5vw 0.5vw 3.5vw rgba(0, 0, 0, 0.4);
          }
        }
        //内容
        .info {
          //名字
          .name {
            color: #b2b2b2;
            font-size: 3.5vw;
            max-width: 70vw;
          }
          //内容
          .value {
            max-width: 64vw;
            overflow: hidden;
            box-shadow: 0.5vw 0.5vw 3.5vw rgba(0, 0, 0, 0.4);
            //文本
            .message {
              word-break: break-all;
              color: @text-c;
              font-size: 3.55vw;
              font-weight: bold;
              line-height: 6.5vw;
              font-family: PingFangSC-Regular, sans-serif;
              padding: 2vw;
            }
            //图片
            .img {
              display: block;
              width: 100%;
              object-fit: contain;
            }
          }
        }
      }
    }
    //chat-item( 左 )
    .chat-item-l {
      .msg-main {
        flex-direction: row;

        .info {
          .name {
            padding-left: 3.1vw;
            margin-bottom: 1vw;
          }
          .value {
            background-color: #fff;
            border-radius: 0 7px 7px 7px;
            margin-left: 2vw;
            // 避免昵称干扰长度
            display: inline-block;
          }
        }
      }
    }
    //chat-item(右)
    .chat-item-r {
      .msg-main {
        flex-direction: row-reverse;
        .info {
          .value {
            border-radius: 7px 0 7px 7px;
            margin-right: 2vw;
            // 右侧文本颜色
            .message {
              color: #fff;
              background-color: @app-color;
            }
          }
        }
      }
    }
  }
}
.submit {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
