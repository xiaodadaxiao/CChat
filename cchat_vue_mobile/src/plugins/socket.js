import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import store from '@/store';
import { baseURL } from '@/common/config';
// socket 连接参数
const socketOptions = {
  autoConnect: false, // 自动连接
  query: {
    token: localStorage.getItem('token'),
  },
};

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO(baseURL, socketOptions),
    vuex: {
      store,
      actionPrefix: 'scoket_',
      mutationPrefix: 'scoket_',
    },
  })
);
