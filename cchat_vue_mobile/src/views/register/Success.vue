<template>
  <div>
    注册成功
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      cid: "10001",
      name: "用户10001",
      email: "123@qq.com",
    };
  },
  created() {
    return;
    const { cid, name, email } = this.$route.query;
    this.email = email;
    this.name = name;
    this.cid = cid;
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
