<template>
  <div class="friend-container">
    <!-- navbar -->
    <van-nav-bar fixed title="好友列表" />
    <!-- 添加好友和好友信息 -->
    <van-cell title="好友申请" center is-link title-style="padding-left:20px">
      <template #icon>
        <van-image
          width="30"
          height="30"
          :src="require('@/assets/img/friend-news.png')"
        />
      </template>
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-badge :content="200" max="99" />
      </template>
    </van-cell>
    <van-cell
      title="添加好友/群"
      center
      is-link
      title-style="padding-left:20px"
      @click="showAddFriend"
    >
      <template #icon>
        <van-image
          width="30"
          height="30"
          :src="require('@/assets/img/add-friend.png')"
        />
      </template>
    </van-cell>
    <!-- 添加界面 -->
    <van-popup
      v-model="isShowAddFriend"
      position="bottom"
      :style="{ height: '30vh', 'padding-top': '2vh' }"
    >
      <van-tabs type="card" animated color="#ff6900">
        <van-tab title="添加好友">
          <van-search
            v-model="inputCid"
            placeholder="输入要添加的用户CID"
            show-action
          >
            <template #action>
              <van-button @click="onSearchCid" size="small">搜索</van-button>
            </template>
          </van-search>
        </van-tab>
        <van-tab title="添加群">
          <van-search
            v-model="inputCid"
            placeholder="输入要添加的群聊GID"
            show-action
          >
            <template #action>
              <van-button @click="onSearchGid" size="small">搜索</van-button>
            </template>
          </van-search>
        </van-tab>
      </van-tabs>
    </van-popup>
    <!-- 好友列表 -->
    <div class="listBox" v-if="Object.keys(friendList).length > 0">
      <van-index-bar :index-list="indexList" :sticky="false">
        <div v-for="(codeList, key) in friendList" :key="key">
          <van-index-anchor :index="key" />
          <van-cell
            v-for="item in codeList"
            :key="item.friendCid"
            center
            :title="item.nickname"
            size="large"
            title-style="padding-left:20px"
          >
            <template #icon>
              <van-image width="40" height="40" :src="item.avatarUrl" />
            </template>
          </van-cell>
        </div>
      </van-index-bar>
    </div>
    <van-empty v-else description="没有好友，快去添加更多好友吧" />
  </div>
</template>

<script>
import { getFriendList } from "@/network/friend";
export default {
  props: {},
  data() {
    return {
      indexList: [], //好友列表索引
      friendList: {}, //好友列表
      isShowAddFriend: false, //是否展示添加面板
      inputCid: "", //输入的cid
      inputGid: "", //输入的gid
    };
  },
  async mounted() {
    try {
      const res = await getFriendList();
      if (res.status == 200 || res.status == 201) {
        //console.log(res);
        this.friendList = res.data;
        this.indexList = Object.keys(res.data); //获得索引数组
      } else {
        return this.$toast.fail("请求好友列表失败");
      }
    } catch (error) {
      this.$toast.fail("请求好友列表错误");
    }
  },
  methods: {
    showAddFriend() {
      this.isShowAddFriend = true;
    },
    onSearchCid() {}, //搜索用户
    onSearchGid() {}, //搜索群
  },
};
</script>

<style lang="less" scoped>
.friend-container {
  padding-top: 46px; //navbar高度
}
.listBox {
  height: calc(
    100vh - 50px - 46px - 100px
  ); //100vh-tabbar高度-navbar高度 -头部添加好友按钮
  overflow: auto;
}
</style>
