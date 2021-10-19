<template>
  <div class="group-info-container">
    <van-nav-bar title="群聊信息" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="avatarBox">
      <van-image height="50vw" width="100vw" :src="groupInfo.avatarUrl" />
    </div>
    <div class="main">
      <div class="info">
        <van-cell title="群名称" :value="groupInfo.gname" />
        <van-cell title="群号" :value="groupInfo.gid" />
        <van-cell title="管理群" is-link v-if="relation.type == groupTypes.RELATION_LEADER" @click="goAdmin" />
        <!-- 群主信息 -->
        <van-cell title="群主" center is-link @click="goUserInfo(groupInfo.leaderInfo.cid)">
          <template #right-icon>
            <van-image width="30" height="30" :src="groupInfo.leaderInfo.avatarUrl" />
            <van-icon name="arrow" />
          </template>
        </van-cell>
        <van-cell title="群简介" value-class="show-one-row" is-link :value="groupInfo.notice" @click="showNoticePopup" />
        <van-cell
          title="我的群昵称"
          is-link
          value-class="show-one-row"
          :value="relation.info.nickname"
          v-if="relation.type != groupTypes.RELATION_STRANGER"
          @click="showNicknamePuoup"
        />
        <van-cell title="接收消息提醒" v-if="relation.type != groupTypes.RELATION_STRANGER">
          <template #right-icon>
            <van-switch v-model="isRemind" active-color="#ff6900" @change="remindChange" />
          </template>
        </van-cell>
        <van-cell title="群人数" :value="groupInfo.count" v-if="relation.type == groupTypes.RELATION_STRANGER" />
        <van-cell title="群成员" is-link :value="groupInfo.count" v-else @click="showListPopup" />
        <!-- 群成员 -->
        <div class="members" v-if="relation.type != groupTypes.RELATION_STRANGER">
          <div class="mem" v-for="member in groupInfo.members" :key="member.cid" @click="goUserInfo(member.cid)">
            <van-image width="50" height="50" :src="member.avatarUrl" />
            <div class="name show-one-row">{{ member.name }}</div>
          </div>
          <div class="mem">
            <van-image width="50" height="50" :src="require('@/assets/img/add.png')" />
            <div class="name show-one-row">添加</div>
          </div>
        </div>
      </div>

      <div class="handle">
        <van-button type="danger" v-if="relation.type == groupTypes.RELATION_JOIN" block>退出群聊</van-button>
        <van-button type="danger" v-if="relation.type == groupTypes.RELATION_LEADER" block>解散群聊</van-button>
        <van-button type="primary" v-if="relation.type == groupTypes.RELATION_STRANGER" block>申请加入群聊</van-button>
      </div>
    </div>
    <!-- 群成员列表 -->
    <van-popup v-model="isShowList" position="bottom" :style="{ height: '80vh' }">
      <van-divider>群成员</van-divider>
      <van-cell
        :title="member.nickname"
        center
        is-link
        title-style="padding-left:20px"
        v-for="member in memberList"
        :key="member.cid"
        @click="goUserInfo(member.cid)"
      >
        <template #icon>
          <van-image width="30" height="30" :src="member.avatarUrl" />
        </template>
        <template #right-icon>
          <van-tag type="danger" v-if="member.role == groupTypes.USER_ROLE_LEADER">群主</van-tag>
          <van-icon name="arrow" />
        </template>
      </van-cell>
    </van-popup>
    <!-- 群公告 -->
    <van-popup v-model="isShowNotice" position="top" :style="{ height: '50vh' }">
      <van-divider>群简介</van-divider>
      <div class="notice">{{ groupInfo.notice }}</div>
    </van-popup>
    <!-- 修改昵称 -->
    <van-popup v-model="isShowNickname" position="bottom" :style="{ height: '50vh' }">
      <van-field v-model.trim="inputNickname" center clearable label="群昵称" placeholder="输入新群昵称">
        <template #button>
          <van-button size="small" type="primary" @click="changeNickname">修改群昵称</van-button>
        </template>
      </van-field>
    </van-popup>
  </div>
</template>

<script>
import { getGroupInfo, getMemberList, changeNickname, changeRemind } from '@/network/group';
import * as groupTypes from '@/constant/group';
export default {
  data() {
    return {
      isShowList: false,
      isShowNotice: false,
      isShowNickname: false,
      inputNickname: '',
      groupTypes,
      gid: '',
      groupInfo: { leaderInfo: {} },
      relation: { info: {} },
      isRemind: true, //是否接收消息
      memberList: [], //群用户
    };
  },
  async created() {
    this.gid = this.$route.params.gid;
    await this.init();
  },
  methods: {
    async init() {
      try {
        const info = await getGroupInfo(this.gid);
        if (info.status !== 200) return this.$toast.fail(info.message);
        this.groupInfo = info.groupInfo;
        this.relation = info.relation;
        this.isRemind = info.relation.info.remind === 1;
      } catch (error) {
        console.log(error);
        this.$toast.fail('请求失败');
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    goUserInfo(cid) {
      this.$router.push('/home/user/' + cid);
    },
    goAdmin() {
      this.$router.push('/home/group/' + this.gid + '/admin');
    },
    async showListPopup() {
      this.isShowList = true;
      //请求群成员数据
      try {
        const res = await getMemberList(this.gid);
        if (res.status != 200) return $toast.fail(res.message);
        this.memberList = res.data;
      } catch (error) {
        console.log(error);
        $toast.fail('请求失败');
      }
    },
    showNoticePopup() {
      this.isShowNotice = true;
    },
    showNicknamePuoup() {
      this.isShowNickname = true;
    },
    //修改群昵称
    async changeNickname() {
      if (this.inputNickname.length <= 0 || this.inputNickname.length > 20) return this.$toast.fail('长度不符合要求');

      try {
        const res = await changeNickname(this.gid, this.inputNickname);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.isShowNickname = false;
        await this.init();
        this.$toast.success('修改成功');
      } catch (error) {
        console.log(error);
        this.$toast.fail('修改失败');
      }
    },
    //修改接收通知
    async remindChange() {
      try {
        //修改请求
        const res = await changeRemind(this.gid, this.isRemind);
        if (res.status !== 200) return this.$toast.fail(res.message);
        await this.init();
        this.$toast.success('修改成功');
      } catch (error) {
        console.log(error);
        this.$toast.fail('修改失败');
      }
    },
  },
};
</script>

<style lang="less" scoped>
.group-info-container {
}
.main {
  padding-top: 2vw;
  background-color: #fff;
  border-radius: 2vw;
  //群信息
  .info {
    //成员展示
    .members {
      background-color: #fff;
      padding: 0 2vw 2vw 2vw;
      display: flex;
      .mem {
        width: 15vw;
        text-align: center;
        .name {
          width: 100%;
          font-size: 3vw;
          text-align: center;
          color: @info-c;
        }
      }
    }
  }
  //操作
  .handle {
    margin-top: 2vw;
  }
}
//群公告面板
.notice {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  padding: 5vw 2vw;
}
</style>
