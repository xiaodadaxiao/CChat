<template>
  <div class="friend-container">
    <!-- navbar -->
    <van-nav-bar fixed title="好友列表" />
    <!-- 添加好友单元格 -->
    <van-cell title="添加好友/群" center is-link title-style="padding-left:20px" @click="showAddFriend">
      <template #icon>
        <van-image width="30" height="30" :src="require('@/assets/img/add-friend.png')" />
      </template>
      <template #right-icon>
        <van-badge :content="friendApplyList.length > 0 ? friendApplyList.length : ''" max="99" />
        <van-icon name="arrow" />
      </template>
    </van-cell>
    <!-- 我的群聊 -->
    <van-cell title="我的群聊" center is-link title-style="padding-left:20px" @click="showGroup">
      <template #icon>
        <van-image width="30" height="30" :src="require('@/assets/img/group.png')" />
      </template>
    </van-cell>
    <!-- 搜索和通知界面 -->
    <van-popup v-model="isShowAddFriend" position="bottom" :style="{ height: '80vh', 'padding-top': '2vh' }">
      <van-tabs type="card" animated color="#ff6900">
        <!-- 好友 -->
        <van-tab :title="'好友申请(' + friendApplyList.length + ')'">
          <van-search v-model.trim="inputCid" placeholder="输入要添加的用户CID" show-action>
            <template #action>
              <van-button @click="onSearchCid" size="small">添加</van-button>
            </template>
          </van-search>
          <!-- 申请列表 -->
          <van-divider>好友申请列表</van-divider>
          <div class="apply-list">
            <van-cell
              :title="item.name"
              v-for="item in friendApplyList"
              :key="item.cid"
              is-link
              :label="item.message"
              title-class="padding-left-2"
              @click="goInfo('user', item.cid)"
            >
              <template #icon>
                <van-image width="40" height="40" :src="item.avatarUrl" />
              </template>
            </van-cell>
          </div>
        </van-tab>
        <!-- 群聊 -->
        <van-tab title="群聊申请(0)">
          <van-search v-model.trim="inputGid" placeholder="输入要添加的群聊GID" show-action>
            <template #action>
              <van-button @click="onSearchGid" size="small">搜索</van-button>
            </template>
          </van-search>
        </van-tab>
      </van-tabs>
    </van-popup>
    <!-- 群聊列表界面 -->
    <van-popup v-model="isShowGroupList" position="bottom" :style="{ height: '80vh', 'padding-top': '2vh' }">
      <van-divider>我的群聊</van-divider>
      <van-cell
        :title="group.gname"
        center
        is-link
        title-style="padding-left:20px"
        @click="goInfo('group', group.gid)"
        v-for="group in groupList"
        :key="group.gid"
      >
        <template #icon>
          <van-image width="30" height="30" :src="group.avatarUrl" />
        </template>
        <template #right-icon>
          <van-icon v-if="group.remind === 0" :name="require('@/assets/img/no-remind.png')" />
          <van-icon name="arrow" />
        </template>
      </van-cell>
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
import { mapState } from 'vuex';
import { getFriendList } from '@/network/friend';
import { getGroupList, searchGroup } from '@/network/group';
import { searchUser } from '@/network/user';
export default {
  props: {},
  data() {
    return {
      indexList: [], //好友列表索引
      friendList: {}, //好友列表
      groupList: [], //群聊列表
      isShowAddFriend: false, //是否展示添加面板
      isShowGroupList: false, //是否展示群聊列表面板
      inputCid: '', //输入的cid
      inputGid: '', //输入的gid
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
        return this.$toast.fail('请求好友列表失败');
      }
    } catch (error) {
      this.$toast.fail('请求好友列表错误');
    }
  },
  methods: {
    showAddFriend() {
      this.isShowAddFriend = true;
    },
    async onSearchCid() {
      if (this.inputCid === '') return;
      const res = await searchUser(this.inputCid);
      if (res.status !== 200) return this.$toast.fail('用户不存在');
      //跳转到用户信息
      this.$router.push('/home/user/' + this.inputCid);
    }, //搜索用户
    async onSearchGid() {
      try {
        const res = await searchGroup(this.inputGid);
        if (res.status !== 200) return this.$toast.fail('群聊不存在');
        //跳转到用户信息
        this.$router.push('/home/group/' + this.inputGid);
      } catch (error) {
        console.log(error);
        this.$toast.fail('请求失败');
      }
    }, //搜索群
    //点击去信息界面
    goInfo(type, id) {
      if (type == 'user') this.$router.push('/home/user/' + id);
      if (type == 'group') this.$router.push('/home/group/' + id);
    },
    //点击显示群聊列表
    async showGroup() {
      this.isShowGroupList = true;
      try {
        const res = await getGroupList();
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.groupList = res.data;
      } catch (error) {
        console.log(error);
        this.$toast.fail('请求群聊列表失败');
      }
    },
  },
  computed: {
    ...mapState(['friendApplyList']),
  },
};
</script>

<style lang="less" scoped>
.friend-container {
  padding-top: 46px; //navbar高度
}
.listBox {
  height: calc(100vh - 50px - 46px - 50px); //100vh-tabbar高度-navbar高度 -头部添加好友按钮
  overflow: scroll;
}
.apply-list {
  height: 55vh;
  overflow: scroll;
}
</style>
