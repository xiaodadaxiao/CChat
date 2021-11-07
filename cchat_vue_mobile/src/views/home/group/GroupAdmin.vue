<template>
  <div class="group-admin-info">
    <van-nav-bar title="管理群" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-cell title="群名称" value-class="show-one-row" :value="groupInfo.gname" is-link @click="showChange('name')" />
    <van-cell title="群简介" value-class="show-one-row" :value="groupInfo.notice" is-link @click="showChange('notice')" />
    <van-cell title="群头像" is-link @click="$refs.upload.chooseFile()" />
    <van-cell title="群成员" :value="groupInfo.count" is-link @click="showList" />
    <!-- 修改界面 -->
    <van-popup v-model="isShowChange" position="bottom" :style="{ height: '50vh' }">
      <!-- 修改群名 -->
      <van-field v-model.trim="inputGname" center clearable label="群名" placeholder="输入新群名" v-show="changeType == 'name'">
        <template #button>
          <van-button size="small" type="primary" @click="changeGname">修改群名</van-button>
        </template>
      </van-field>
      <!-- 修改简介 -->
      <div v-show="changeType == 'notice'">
        <van-field v-model.trim="inputNotice" center type="textarea" maxlength="300" clearable placeholder="输入新群简介" rows="5" show-word-limit />
        <van-button size="small" type="primary" @click="changeNotice">修改群简介</van-button>
      </div>
    </van-popup>
    <!-- 管理群成员界面 -->
    <van-popup v-model="isShowList" position="bottom" :style="{ height: '80vh' }">
      <van-divider>群成员</van-divider>
      <van-cell :title="member.nickname" center title-style="padding-left:20px" v-for="member in memberList" :key="member.cid">
        <template #icon>
          <van-image width="30" height="30" @click="goUserInfo(member.cid)" :src="member.avatarUrl" />
        </template>
        <template #right-icon>
          <van-tag type="danger" v-if="member.role == groupTypes.USER_ROLE_LEADER">群主</van-tag>
          <van-button icon="warning-o " v-if="member.role != groupTypes.USER_ROLE_LEADER" type="warning" size="small" @click="changeUser('ban', member.cid)" />
          <van-button icon="delete" v-if="member.role != groupTypes.USER_ROLE_LEADER" type="danger" size="small" @click="changeUser('delete', member.cid)" />
        </template>
      </van-cell>
    </van-popup>
    <van-uploader accept="image/*" :after-read="afterReadImage" ref="upload" preview-size="0" />
  </div>
</template>

<script>
import * as groupTypes from '@/constant/group';
import { updateGname, updateNotice, getGroupInfo, getMemberList, removeUser } from '@/network/group';
import { uploadGroupAvatar } from '@/network/file';
export default {
  data() {
    return {
      groupTypes,
      isShowChange: false,
      isShowList: false,
      changeType: '',
      inputGname: '',
      inputNotice: '',
      gid: '',
      groupInfo: {},
      memberList: [],
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
    async showList() {
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
    //展示修改面板
    showChange(type) {
      this.changeType = type;
      this.isShowChange = true;
    },
    //修改群名
    async changeGname() {
      if (this.inputGname == '' || this.inputGname.length > 20) return this.$toast.fail('群名长度不合法');

      try {
        const res = await updateGname(this.gid, this.inputGname);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('修改成功');
        this.inputGname = '';
        this.isShowChange = false;
        await this.init();
      } catch (error) {
        console.log(error);
        this.$toast.fail('请求失败');
      }
    },
    //修改群简介
    async changeNotice() {
      if (this.inputNotice == '' || this.inputNotice.length > 300) return this.$toast.fail('群简介长度不合法');

      try {
        const res = await updateNotice(this.gid, this.inputNotice);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('修改成功');
        this.inputNotice = '';
        this.isShowChange = false;
        await this.init();
      } catch (error) {
        console.log(error);
        this.$toast.fail('请求失败');
      }
    },
    //点击更改用户
    async changeUser(type, cid) {
      if (type == 'delete') {
        //删除用户
        const confirm = await this.$dialog.confirm({
          title: '移除用户',
          message: '是否要移除该用户？',
        });
        if (confirm != 'confirm') return;
        //发送请求
        const res = await removeUser(this.gid, cid);
        if (res.status != 200) return this.$toast.fail(res.message);
        this.$toast.success('移除成功');
        this.isShowList = false;
        this.init();
      }
      if (type == 'ban') {
        //禁言用户
        const confirm = await this.$dialog.confirm({
          title: '禁言用户',
          message: '是否要禁言该用户？',
        });
        if (confirm != 'confirm') return;
        this.$toast.fail('抱歉，禁言功能未开放');
      }
    },
    //上传群头像
    async afterReadImage(file) {
      console.log(file);
      if (file.file.size > 10 * 1024 * 1024) return this.$toast.fail('图片不能超过10M！');
      try {
        const formData = new FormData();
        formData.append('avatar', file.file);
        const res = await uploadGroupAvatar(this.gid, formData);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('上传成功');
      } catch (error) {
        console.log(error);
        this.$toast.fail('发生错误');
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
