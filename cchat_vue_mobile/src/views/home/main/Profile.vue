<template>
  <div class="profile-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar title="个人中心"> </van-nav-bar>
    <div class="info">
      <div class="img">
        <van-image round width="120" height="120" :src="userInfo.avatarUrl" @click="clickAvatar" />
      </div>
      <div class="name">{{ userInfo.name }}</div>
      <p class="signature">{{ userInfo.signature }}</p>
    </div>
    <div class="handle">
      <van-cell-group inset>
        <van-cell center :value="userInfo.cid">
          <template #title>
            <van-icon class="icon" name="certificate" />
            <span class="title">CID</span>
          </template>
        </van-cell>

        <van-cell is-link center @click="$refs.upload.chooseFile()">
          <template #title>
            <van-icon class="icon" name="smile-comment-o" />
            <span class="title">头像</span>
          </template>
        </van-cell>

        <van-cell is-link center @click="clickEdit('name')">
          <template #title>
            <van-icon class="icon" name="user-circle-o" />
            <span class="title">昵称</span>
          </template>
        </van-cell>
        <van-cell is-link center @click="clickEdit('signature')">
          <template #title>
            <van-icon class="icon" name="edit" />
            <span class="title">签名</span>
          </template>
        </van-cell>
        <van-cell is-link center @click="clickEdit('password')">
          <template #title>
            <van-icon class="icon" name="shield-o" />
            <span class="title">密码</span>
          </template>
        </van-cell>
        <van-cell is-link center :style="{ color: 'red' }" @click="clickExit">
          <template #title>
            <van-icon class="icon" name="share-o" />
            <span class="title">退出登录</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-popup v-model="isShowEdit" position="bottom" :style="{ height: '50vh', 'padding-top': '2vh' }">
      <!-- 修改昵称 -->
      <van-field v-model.trim="inputName" v-show="editType == 'name'" center clearable label="昵称" placeholder="输入新昵称">
        <template #button>
          <van-button size="small" type="primary" @click="changeName">修改昵称</van-button>
        </template>
      </van-field>
      <!-- 修改签名 -->
      <van-field v-show="editType == 'signature'" v-model.trim="inputSignature" type="textarea" center clearable label="签名" placeholder="输入新签名">
        <template #button>
          <van-button size="small" type="primary" @click="changeSignature">修改签名</van-button>
        </template>
      </van-field>
      <!-- 修改密码 -->
      <van-field v-show="editType == 'password'" v-model.trim="inputOldPassword" type="password" label="原密码" placeholder="输入原密码"></van-field>
      <van-field v-show="editType == 'password'" v-model.trim="inputNewPassword" type="password" label="新密码" placeholder="输入新密码"></van-field>
      <van-field v-show="editType == 'password'" v-model.trim="inputNewPassword2" type="password" label="再次输入" placeholder="再次输入新密码"></van-field>
      <van-button v-show="editType == 'password'" size="small" type="primary" @click="changePassword">修改密码</van-button>
    </van-popup>
    <van-uploader accept="image/*" :after-read="afterReadImage" ref="upload" preview-size="0" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getUserInfo, changeName, changeSignature, changePassword } from '@/network/user';
import { uploadAvatar } from '@/network/file';
import Val from '@/utils/validator';
//展示图片函数
import { ImagePreview } from 'vant';
export default {
  data() {
    return {
      userInfo: {},
      isShowEdit: false,
      editType: 'name',
      inputName: '',
      inputSignature: '',
      inputOldPassword: '',
      inputNewPassword: '',
      inputNewPassword2: '',
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        const res = await getUserInfo(this.userCid);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.userInfo = res.userInfo;
      } catch (error) {
        console.log(error);
        this.$toast.fail('请求出错');
      }
    },
    clickAvatar() {
      ImagePreview([this.userInfo.avatarUrl]);
    },

    exit() {
      localStorage.removeItem('token');
      this.$store.commit('useIsLogin', { flag: false });
      this.$router.replace('/login');
    },
    async clickExit() {
      try {
        const confirm = await this.$dialog.confirm({
          title: '退出登录',
          message: '是否要退出账号登录？',
        });
        if (confirm != 'confirm') return;
        this.exit();
      } catch (error) {
        if (error == 'cancel') return;
        console.log(error);
        this.$toast.fail('退出失败');
      }
    },
    clickEdit(type) {
      this.editType = type;
      this.isShowEdit = true;
    },
    //修改昵称
    async changeName() {
      if (!new Val(this.inputName).len(1, 30).end()) {
        return this.$toast.fail('昵称长度应为1-30');
      }
      try {
        this.isShowEdit = false;
        const res = await changeName(this.inputName);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('修改成功！');
        this.init();
      } catch (error) {
        console.log(error);
        this.$toast.fail('修改昵称失败！');
      }
    },
    //修改签名
    async changeSignature() {
      if (!new Val(this.inputSignature).len(1, 50).end()) {
        return this.$toast.fail('个性签名长度应为1-50');
      }
      try {
        this.isShowEdit = false;
        const res = await changeSignature(this.inputSignature);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('修改成功！');
        this.init();
      } catch (error) {
        console.log(error);
        this.$toast.fail('修改签名失败！');
      }
    },
    //修改密码
    async changePassword() {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      const vo = new Val(this.inputOldPassword)
        .len(6, 50)
        .reg(reg)
        .end();
      const vn = new Val(this.inputNewPassword)
        .len(6, 50)
        .reg(reg)
        .end();
      if (!vo || !vn) {
        return this.$toast.fail('密码需包含6-50位数字和英文');
      }
      if (this.inputNewPassword !== this.inputNewPassword2) {
        return this.$toast.fail('两次输入密码不一致');
      }
      try {
        const res = await changePassword(this.inputOldPassword, this.inputNewPassword);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('修改成功,请重新登录');
        this.exit();
      } catch (error) {
        console.log(error);
        this.$toast.fail('修改密码失败');
      }
    },
    //上传图片
    async afterReadImage(file) {
      console.log(file);
      if (file.file.size > 5 * 1024 * 1024) return this.$toast.fail('图片不能超过5M！');
      try {
        const formData = new FormData();
        formData.append('avatar', file.file);
        const res = await uploadAvatar(formData);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$toast.success('上传成功');
        this.init();
      } catch (error) {
        console.log(error);
        this.$toast.fail('发生错误');
      }
    },
  },
  computed: {
    ...mapState(['userCid']),
  },
};
</script>

<style lang="less" scoped>
.profile-container {
  width: 100vw;
  height: calc(100vh - 50px);
  overflow: scroll;
  box-sizing: border-box;
}
.info {
  margin: 3vw 5vw;
  padding: 1vw 6vw;
  border-radius: 3vw;
  background-color: rgba(255, 105, 0, 1);
  & > div {
    text-align: center;
  }
  .img {
    padding: 5vw;
  }
  .name {
    font-weight: 600;
    font-size: 8vw;
    color: #fff;
  }
  .signature {
    text-align: center;
    text-align-last: left;

    padding: 0 10%;
    font-weight: 600;
  }
}
.handle {
  .title {
    vertical-align: middle;
    line-height: inherit;
  }
  .icon {
    font-size: 19px;

    margin-right: 2vw;
    vertical-align: middle;
  }
}
</style>
