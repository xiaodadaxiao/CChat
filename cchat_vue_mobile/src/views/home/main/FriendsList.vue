<template>
  <div>
    <van-cell title="好友申请" />
    <van-cell title="添加好友" />

    <van-index-bar>
      <van-index-anchor index="A" />
      <van-cell
        v-for="i in 10"
        title="刘德华"
        size="large"
        title-style="padding-left:20px"
      >
        <template #icon>
          <van-image
            width="30"
            height="30"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
        </template>
      </van-cell>

      <van-index-anchor index="B" />
      <van-cell
        v-for="i in 10"
        title="张学友"
        size="large"
        title-style="padding-left:20px"
      >
        <template #icon>
          <van-image
            width="30"
            height="30"
            src="https://tu1.whhost.net/uploads/20181029/19/1540812779-acpPtjmyEY.jpg"
          />
        </template>
      </van-cell>
    </van-index-bar>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
