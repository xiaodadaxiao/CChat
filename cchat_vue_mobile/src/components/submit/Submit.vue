<template>
  <div class="submit-container" ref="submitRef">
    <!-- 输入框 -->
    <div class="submit">
      <textarea v-model.trim="inputValue" rows="1" placeholder="输入信息" class="input" />
      <!-- 表情 -->
      <van-icon name="smile-o" size="34" :style="{ color: isShowEmjoi ? '#ff6900' : 'black' }" @click="clickShowEmjoi" />
      <!-- +号 -->
      <van-icon
        name="add-o"
        size="34"
        v-show="!isShowBtn"
        :style="{ color: isShowMore ? '#ff6900' : 'black' }"
        @click="clickShowMore"
      />
      <van-button v-show="isShowBtn" type="primary" size="small" @click="send">发送</van-button>
    </div>
    <!-- 表情区-->
    <div class="emjoi" v-show="isShowEmjoi">
      <div v-for="(e, i) in emjoiList" :key="i" @click="inputValue += e">{{ e }}</div>
    </div>

    <!-- 操作区 -->
    <div class="more" v-show="isShowMore">
      <van-uploader accept="image/*" :after-read="afterReadImage">
        <div class="more-item">
          <img :src="require('@/assets/img/image.png')" />
          <div>图片</div>
        </div>
      </van-uploader>
      <div class="more-item" @click="isShowLocation = true">
        <img :src="require('@/assets/img/position.png')" />
        <div>位置</div>
      </div>
    </div>
    <!-- 定位 -->
    <van-popup v-model="isShowLocation" position="bottom" :style="{ height: '70vh' }">
      <van-divider>由于浏览器限制，仅提供IP模糊定位</van-divider>
      <baidu-map :center="center" :zoom="zoom" class="location-view" ak="baiduMapKey" @ready="mapReady">
        <bm-control anchor="BMAP_ANCHOR_TOP_RIGHT">
          <van-button
            :type="disSendLocation ? 'defalut' : 'primary'"
            class="sendLocation"
            :disabled="disSendLocation"
            @click="sendLocation"
            >发送定位</van-button
          >
        </bm-control>
        <bm-geolocation
          @locationSuccess="locationSuccess"
          @locationError="locationError"
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :locationIcon="{ url: require('@/assets/img/location.png'), size: { width: 48, height: 48 } }"
        ></bm-geolocation>
      </baidu-map>

      <div class="lac-name">
        <div class="show-one-row address">{{ locationInfo.formatted_address }}</div>
        <div class="show-one-row business">{{ locationInfo.business }}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import * as messageType from '@/constant/message';
import emjoiList from './emjoiData';
import { uploadImage } from '@/network/file';
// 地图
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import { BmGeolocation, BmControl } from 'vue-baidu-map';
import { baiduMapKey } from '@/common/config';
import { getLocation } from '@/network/location';
export default {
  props: {},
  data() {
    return {
      inputValue: '',
      isShowBtn: false,
      isShowEmjoi: false, //切换展示表情
      isShowMore: false,
      isShowLocation: false,
      emjoiList,
      baiduMapKey, //百度地图key
      center: { lng: 100, lat: 100 },
      zoom: 3,
      disSendLocation: true,
      locationInfo: {},
    };
  },
  components: {
    BaiduMap,
    BmGeolocation,
    BmControl,
  },
  mounted() {},
  methods: {
    //计算元素高度
    getHeight() {
      const height = this.$refs.submitRef.offsetHeight;
      this.$emit('heightChange', height);
    },
    //点击切换展示表情
    clickShowEmjoi() {
      this.isShowMore = false;
      this.isShowEmjoi = !this.isShowEmjoi;
      //计算高度
      this.$nextTick(this.getHeight);
    },
    //点击切换更多
    clickShowMore() {
      this.isShowEmjoi = false;
      this.isShowMore = !this.isShowMore;
      //计算高度
      this.$nextTick(this.getHeight);
    },
    //上传图片
    async afterReadImage(file) {
      if (file.file.size > 5 * 1024 * 1024) return this.$toast.fail('图片不能超过5M！');
      try {
        const formData = new FormData();
        formData.append('image', file.file);
        const res = await uploadImage(formData);
        if (res.status !== 200) return this.$toast.fail(res.message);
        this.$emit('send', messageType.IMAGE, res.url);
      } catch (error) {
        console.log(error);
        this.$toast.fail('发生错误');
      }
    },

    //点击文本发送
    send() {
      this.$emit('send', messageType.TEXT, this.inputValue);
      this.inputValue = '';
    },
    //地图加载完成
    mapReady({ BMap, map }) {
      // console.log(BMap, map);
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 15;
    },
    //定位成功
    locationSuccess({ point }) {
      //console.log(point);
      this.center.lat = point.lat;
      this.center.lng = point.lng;
      this.disSendLocation = false;
      //获取位置的基本信息
      getLocation(point).then(
        res => {
          this.locationInfo = res.data.result;
        },
        err => console.log(err)
      );
    },
    //定位失败
    locationError() {
      this.$toast.fail('定位失败');
    },
    //发送定位
    sendLocation() {
      this.$emit('send', messageType.LOCATION, JSON.stringify(this.center));
      this.isShowLocation = false;
    },
  },
  watch: {
    inputValue() {
      this.isShowBtn = this.inputValue.length > 0;
    },
  },
};
</script>

<style lang="less" scoped>
.submit-container {
  //输入栏
  .submit {
    display: flex;
    flex-direction: row;
    padding: 3vw 2vw;
    background-color: #e1e1e1;
    .input {
      flex: 1;
      margin: 0 1vw;
    }
  }
  //表情栏
  .emjoi {
    width: 100vw;
    height: 20vh;
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    padding: 5vw;
    box-sizing: border-box;
    & > div {
      width: 15vw;
      height: 15vw;
      text-align: center;
      font-size: 7vw;
      line-height: 15vw;
    }
  }
  //更多操作区
  .more {
    width: 100vw;
    height: 20vh;
    display: flex;
    overflow: scroll;
    .more-item {
      width: 25vw;
      height: 15vh;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 50%;
        margin-bottom: 1vw;
      }
    }
  }

  //定位 百度地图
  .location-view {
    width: 100vw;
    height: 50vh;
    .BMap_geolocationIcon {
      width: 50px !important;
    }
    .sendLocation {
      margin: 2vw;
    }
  }
  //地理位置
  .lac-name {
    padding: 2vw;
    .address {
      font-size: 5vw;
    }
    .business {
      color: rgb(165, 152, 152);
    }
  }
}
</style>
