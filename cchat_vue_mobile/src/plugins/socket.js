import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import store from '@/store';
// import { baseURL } from '@/common/config';
// socket 连接参数
const socketOptions = {
  autoConnect: false, // 自动连接
  query: {
    token: localStorage.getItem('token'),
  },
};

const vueSocketIO = new VueSocketIO({
  debug: false,
  connection: SocketIO(process.env.VUE_APP_BASE_URL, socketOptions),
  vuex: {
    store,
    actionPrefix: 'socket_',
    mutationPrefix: 'socket_',
  },
});
//提交函数
function socketEmit(emitName, data) {
  return new Promise((resolve, reject) => {
    //提交名，数据，回调函数（回调数据，错误）
    vueSocketIO.io.emit(emitName, data, (res, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(res);
      }
    });
  });
}
export { vueSocketIO, socketEmit };
