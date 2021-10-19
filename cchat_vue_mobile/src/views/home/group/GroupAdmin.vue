<template>
  <div class="group-admin-info">
    <van-nav-bar title="管理群" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-cell title="群名称" value-class="show-one-row" value="123交流群" is-link />
    <van-cell title="群简介" value-class="show-one-row" value="欢迎加入" is-link />
    <van-cell title="群头像" is-link />
    <van-cell title="群成员" value="30" is-link />
  </div>
</template>

<script>
export default {
  data() {
    return {
      gid: '',
    };
  },
  created() {
    this.gid = this.$route.params.gid;
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped></style>
