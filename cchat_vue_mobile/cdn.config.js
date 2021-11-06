module.exports = {
  build: {
    css: ['https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css'],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6/dist/vue.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vant@2.12/lib/vant.min.js',
      'https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js',
      'https://cdn.jsdelivr.net/npm/vue-socket.io@3.0.10/dist/vue-socketio.min.js',
      'https://cdn.jsdelivr.net/npm/vue-baidu-map@0.21.22/index.min.js',
    ],
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    vant: 'vant',
    axios: 'axios',
    'vue-socket.io': 'VueSocketIO',
    'vue-baidu-map': 'VueBaiduMap',
  },
};
