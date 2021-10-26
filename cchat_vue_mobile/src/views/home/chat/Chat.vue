<template>
  <div class="chat-container">
    <van-nav-bar
      :title="chatType == 'friend' ? friendInfo.nickname : groupInfo.gname"
      left-text="返回"
      right-text="按钮"
      left-arrow
      fixed
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
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
          <!-- 左侧发言 -->
          <div class="chat-item chat-item-l" v-if="userCid !== item.talker_cid">
            <div class="time">{{ item.updateAt }}</div>
            <div class="msg-main">
              <!-- 头像 -->
              <div class="avatar">
                <van-image width="45" height="45" :src="item.avatar_url" />
              </div>
              <!-- 名字和内容 -->
              <div class="info">
                <div class="name show-one-row" v-if="chatType == 'group'">{{ item.nickname }}</div>
                <div class="value">
                  <!-- 文本 -->
                  <div class="message" v-if="item.type == messageType.TEXT">
                    {{ item.content }}
                  </div>
                  <!-- 图片 -->
                  <van-image
                    fit="contain"
                    @click="clickImg(item.content)"
                    v-if="item.type == messageType.IMAGE"
                    :src="item.content"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧发言 -->
          <div class="chat-item chat-item-r" v-else>
            <div class="time">{{ item.updateAt }}</div>
            <div class="msg-main ">
              <!-- 头像 -->
              <div class="avatar">
                <van-image width="45" height="45" :src="item.avatar_url" />
              </div>
              <!-- 名字和内容 -->
              <div class="info">
                <!-- <div class="name show-one-row"></div> -->
                <div class="value">
                  <!-- 文本 -->
                  <div class="message" v-if="item.type == messageType.TEXT">
                    {{ item.content }}
                  </div>
                  <!-- 图片 -->
                  <van-image
                    fit="contain"
                    @click="clickImg(item.content)"
                    v-if="item.type == messageType.IMAGE"
                    :src="item.content"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 操作栏 -->
    <submit class="submit" @heightChange="submitHeightChange" @send="send" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
//展示图片函数
import { ImagePreview } from 'vant';
import { searchGroup } from '@/network/group';
import { getFriendInfo } from '@/network/friend';
import { getFriendMessage, getGroupMessage } from '@/network/message';
import * as messageType from '@/constant/message';
import Submit from '@/components/submit/Submit';
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
  components: { Submit },
  async created() {
    const { type, id } = this.$route.params;
    this.chatType = type;
    this.chatId = id;
    try {
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
    } catch (error) {
      console.log(error);
      this.$toast.fail('请求数据错误');
    }
  },
  async mounted() {
    //请求聊天数据
    try {
      if (this.chatType == 'friend') {
        const res = await getFriendMessage(this.chatId, this.friendMessage.length, this.page * 10);
        if (res.status !== 200) return this.$toast.fail(res.messag);
        this.friendMessage.push(...res.data);
        //排序
        this.friendMessage.sort((a, b) => new Date(a.updateAt) - new Date(b.updateAt));
      }
      if (this.chatType == 'group') {
        const res = await getGroupMessage(this.chatId, this.groupMessage.length, this.page * 10);
        if (res.status !== 200) return this.$toast.fail(res.messag);
        this.groupMessage.push(...res.data);
        //排序
        this.groupMessage.sort((a, b) => new Date(a.updateAt) - new Date(b.updateAt));
      }
      //得到滑动区域
      this.scrollDiv = document.querySelector('.chat-list');
      //滑动到底部
      this.$nextTick(() => {
        this.scrollDiv.scrollTop = this.scrollDiv.scrollHeight;
      });
    } catch (error) {
      console.log(error);
      this.$toast.fail('请求聊天数据错误');
    }
  },
  methods: {
    onClickLeft() {
      // this.$router.replace('/home/main');
      this.$router.go(-1);
    },
    onClickRight() {
      console.log('right');
    },
    //上拉加载
    onLoad() {
      console.log('加载。。。');
      setTimeout(() => {
        this.loading = false;
        this.finished = true;
      }, 1000);
    },
    //输入栏高度变化
    submitHeightChange(h) {
      this.bottomHeight = h;
      //滑动到底部
      this.$nextTick(() => {
        this.scrollDiv.scrollTop = this.scrollDiv.scrollHeight;
      });
    },
    //输入栏传输数据
    send(type, value) {
      console.log(type, value);
    },
    //点击预览图片
    clickImg(url) {
      ImagePreview([url]);
    },
  },
  computed: {
    ...mapState(['userCid']),
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
        //头像
        .avatar {
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
            //文本
            .message {
              word-break: break-all;
              color: @text-c;
              font-size: 4.2vw;
              line-height: 6.5vw;
              padding: 2vw;
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
            overflow: hidden;
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
            overflow: hidden;
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
