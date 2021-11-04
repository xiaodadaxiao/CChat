<template>
  <div class="map-message-container">
    <div class="lac-name">
      <div class="show-one-row address">{{ locationInfo.formatted_address }}</div>
      <div class="show-one-row business">{{ locationInfo.business }}</div>
    </div>
    <baidu-map :center="center" :zoom="zoom" class="location-view" :ak="baiduMapKey" @ready="mapReady">
      <bm-marker
        :position="propCenter"
        animation="BMAP_ANIMATION_BOUNCE"
        :dragging="false"
        :icon="{ url: require('@/assets/img/location.png'), size: { width: 48, height: 48 } }"
      ></bm-marker>
    </baidu-map>
    <div class="tips">仅提供IP模糊定位，仅供参考</div>
  </div>
</template>

<script>
import { getLocation } from '@/network/location';
// 地图
import BaiduMap from 'vue-baidu-map/components/map/Map.vue';
import { BmMarker } from 'vue-baidu-map';
import { baiduMapKey } from '@/common/config';
export default {
  props: {
    centerStr: {
      type: String,
      default: "{'lng': 116.404,'lat': 39.915 }",
    },
  },
  components: { BaiduMap, BmMarker },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 3,
      baiduMapKey,
      locationInfo: {},
    };
  },
  created() {
    //获取位置的基本信息
    getLocation(this.propCenter).then(
      res => {
        this.locationInfo = res.data.result;
      },
      err => console.log(err)
    );
  },
  methods: {
    mapReady() {
      this.center.lng = this.propCenter.lng;
      this.center.lat = this.propCenter.lat;
      this.zoom = 13;
    },
  },
  computed: {
    propCenter() {
      return JSON.parse(this.centerStr);
    },
  },
};
</script>

<style lang="less" scoped>
.map-message-container {
  .location-view {
    width: 64vw;
    height: 60vw;
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
  .tips {
    color: #ccc;
    font-size: 3vw;
    padding: 1vw;
  }
}
</style>
