<template>
  <div class="userinfo-container">
    <div class="bg-img" :style="{ backgroundImage: 'url(' + userInfo.avatarUrl + ')' }"></div>
    <van-nav-bar title="用户信息" left-arrow @click-left="onClickLeft" @click-right="isShowFriendHandle = true">
      <template #right v-if="relation.type == userTypes.RELATION_FRIEND">
        <van-icon name="wap-nav" size="20" color="#ff6900" />
      </template>
    </van-nav-bar>
    <div class="main">
      <!-- 用户信息展示 -->
      <div class="info">
        <van-image class="img" radius="10" :src="userInfo.avatarUrl" />
        <div class="big-name">{{ relation.type == userTypes.RELATION_FRIEND ? relation.info.nickname : userInfo.name }}</div>
        <div class="small-name">
          CID:{{ userInfo.cid }} {{ relation.type == userTypes.RELATION_FRIEND ? '昵称：' + userInfo.name : '' }}
        </div>
        <div class="signature">{{ userInfo.signature }}</div>
        <div class="apply-message" v-if="relation.type == userTypes.RELATION_ADDING_ME">
          <span class="tip"> [对方正在申请添加你为好友] : </span>
          <span>{{ relation.info.message }}</span>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="handle">
        <van-button block color="#ff6900" v-if="relation.type == userTypes.RELATION_FRIEND" @click="clickChat">
          发送消息
        </van-button>
        <van-button block type="info" @click="showPopup" v-if="relation.type == userTypes.RELATION_STRANGER">
          申请添加好友
        </van-button>
        <van-button block type="default" disabled v-if="relation.type == userTypes.RELATION_ME_ADDING">
          已发送好友请求
        </van-button>
        <van-button block type="primary" v-if="relation.type == userTypes.RELATION_ADDING_ME" @click="agree">
          同意-添加好友请求
        </van-button>
        <van-button block type="danger" v-if="relation.type == userTypes.RELATION_ADDING_ME" @click="reject">
          拒绝-添加好友请求
        </van-button>
      </div>
      <!-- 添加好友面板 -->
      <van-popup v-model="isShowPoupup" round position="bottom" :style="{ height: '30vh' }">
        <van-field label="申请内容" placeholder="输入请求消息" v-model.trim="inputText">
          <template #button>
            <van-button size="small" type="primary" @click="addFriendApply">发送请求</van-button>
          </template>
        </van-field>
      </van-popup>
      <!-- 好友操作面板 -->
      <van-action-sheet v-model="isShowFriendHandle" :actions="friendActions" @select="onFriendHandleSelect" />
      <!-- 好友修改昵称面板 -->
      <van-popup v-model="isShowHandlePoupup" round position="bottom" :style="{ height: '30vh' }">
        <van-field label="修改备注" placeholder="输入新备注" v-model.trim="inputNickname">
          <template #button>
            <van-button size="small" type="primary" @click="changeNickname">修改</van-button>
          </template>
        </van-field>
      </van-popup>
    </div>
  </div>
</template>

<script>
import * as userTypes from '@/constant/user';
import * as messageType from '@/constant/message';
import * as friendTypes from '@/constant/friend';
import { mapState } from 'vuex';
import { getUserInfo } from '@/network/user';
import {
  addFriendApply,
  agreeApply,
  rejectApply,
  deleteFriend,
  changeNickname,
  backlist,
  removeBacklist,
} from '@/network/friend';
export default {
  props: {},
  data() {
    return {
      userTypes,
      messageType,
      isShowPoupup: false,
      isShowHandlePoupup: false,
      userCid: '',
      myCid: '',
      userInfo: {},
      relation: {}, //用户关系信息
      inputText: '',
      isShowFriendHandle: false, //是否展示好友操作

      isShowHandlePoupup: false,
      inputNickname: '',
    };
  },

  async mounted() {
    this.userCid = this.$route.params.cid;
    //请求用户信息
    await this.getInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    //请求用户信息
    async getInfo() {
      // 请求用户信息
      const info = await getUserInfo(this.userCid);
      if (info.status !== 200) {
        this.$toast.fail(info.message);
      }
      this.userInfo = info.userInfo;
      this.relation = info.relation;
    },
    //点击聊天
    clickChat() {
      this.$router.push('/home/chat/friend/' + this.userInfo.cid);
    },
    //点击展示申请好友
    showPopup() {
      this.isShowPoupup = true;
    },
    //添加好友请求
    async addFriendApply() {
      let res = await addFriendApply(this.userInfo.cid, this.inputText);
      console.log(res);
      if (res.status !== 200) {
        return this.$toast.fail(res.message);
      }
      this.$toast.success('发送成功');
      /* socket通知 */
      this.$socketEmit('friendApply', { fromCid: this.cid, toCid: this.userCid });
      // 请求用户信息
      await this.getInfo();
      //关闭弹窗
      this.isShowPoupup = false;
    },
    //同意请求
    async agree() {
      const res = await agreeApply(this.userInfo.cid);
      if (res.status !== 200) return this.$toast.fail(res.message);
      //发送第一句话
      this.$socketEmit('message', {
        content: '我已同意你的好友请求',
        chatId: this.userCid,
        chatType: this.messageType.CHAT_FRIEND,
        type: this.messageType.TEXT,
      });
      this.getInfo();
      this.$store.dispatch('requestFriendApplyList');
    },
    async reject() {
      this.$dialog
        .confirm({
          title: '拒绝请求',
          message: '确定拒绝该用户的好友请求吗?',
        })
        .then(() => {
          rejectApply(this.userInfo.cid)
            .then(res => {
              console.log(res);
              if (res.status !== 200) {
                return this.$toast.fail(res.message);
              }
              this.getInfo();

              this.$store.dispatch('requestFriendApplyList');
            })
            .catch(err => this.$toast.fail('请求失败'));
        })
        .catch(() => {
          console.log('取消确定');
        });
    },

    //好友操作
    async onFriendHandleSelect({ name }) {
      this.isShowFriendHandle = false;
      //1 删除好友
      if (name == '删除好友') {
        const confirm = await this.$dialog.confirm({
          title: '删除好友',
          message: '是否要删除该好友？',
        });
        if (confirm != 'confirm') return;
        const res = await deleteFriend(this.userCid);
        if (res.status !== 200) this.$toast.fail(res.message);
        this.$toast.success('删除成功');
        this.getInfo();
        this.$store.dispatch('requestIndexMessage');
        this.$router.replace('/home/main');
      }
      //2 修改备注
      if (name == '修改备注') {
        this.isShowHandlePoupup = true;
        this.inputNickname = '';
      }
      //3 加入黑名单
      if (name == '加入黑名单') {
        const confirm = await this.$dialog.confirm({
          title: '加入黑名单',
          message: '是否要将好友加入黑名单？',
        });
        if (confirm != 'confirm') return;
        const res = await backlist(this.userCid);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('修改成功');
        this.getInfo();
      }
      //4 移出黑名单
      if (name == '移出黑名单') {
        const res = await removeBacklist(this.userCid);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('移出成功');
        this.getInfo();
      }
    },
    //点击修改好友备注
    async changeNickname() {
      if (this.inputNickname == '' || this.inputNickname.length > 20) {
        return this.$toast.fail('备注需为20位以下非空字符串');
      }
      try {
        const res = await changeNickname(this.userCid, this.inputNickname);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('修改成功');
        this.isShowHandlePoupup = false;
        this.getInfo();
        this.$store.dispatch('requestIndexMessage');
      } catch (error) {
        console.log(error);
        this.$toast.fail('修改出错');
      }
    },
  },
  computed: {
    ...mapState({ cid: 'userCid' }),
    //好友操作选项
    friendActions() {
      const action = [{ name: '修改备注' }, { name: '删除好友', color: 'red' }];
      if (this.relation.type == userTypes.RELATION_FRIEND && this.relation.info.state == friendTypes.BLACKLIST) {
        action.push({ name: '移出黑名单' });
      }
      if (this.relation.type == userTypes.RELATION_FRIEND && this.relation.info.state == friendTypes.NORMAL) {
        action.push({ name: '加入黑名单', color: 'red' });
      }
      return action;
    },
  },
};
</script>

<style lang="less" scoped>
.userinfo-container {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  //背景图片
  .bg-img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100vw 100vh;
    filter: blur(2.2vw);
    opacity: 0.4;
  }
}
.main {
  width: 100%;
  height: 97vh;
  background-color: #fff;
  z-index: 99;
  .info {
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    // height: 50%;
    padding: 2vh 0;
    .img {
      width: 45vw;
      height: 45vw;
      text-align: center;
    }
    .big-name {
      font-size: 9vw;
      padding: 2vh 0;
    }
    .small-name {
      color: @app-color;
    }
    .signature {
      font-size: 3.5vw;
      margin: 2vh 0;
      color: #272832;
      width: 60vw;
    }
    .apply-message {
      font-size: 3.5vw;
      margin: 2vh 0;
      width: 60vw;
      padding: 1vw;
      border: 1px solid #ccc;
      background-color: #fff;
      padding: 2vw;
      opacity: 0.9;
      border-radius: 2vw;
      .tip {
        color: red;
      }
      .message {
        color: black;
      }
    }
  }
  .handle {
    & > button {
      margin-top: 1vw;
    }
    padding: 0 10vw;
  }
}
</style>
