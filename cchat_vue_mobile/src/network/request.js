import axios from 'axios';
import { Toast } from 'vant';

//axios实例
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  //请求时间最长
  timeout: 10000,
});
//请求拦截器
instance.interceptors.request.use(
  config => {
    config.headers = {
      //请求头携带token
      Authorization: localStorage.getItem('token'),
    };
    //loding
    // Toast.loading({
    //   duration: 0, // 持续展示 toast
    //   forbidClick: true,
    //   message: '加载中',
    // });
    //最后传递处理后的数据
    return config;
  },
  err => {
    Toast.fail('网络请求失败!');
    console.log(err);
  }
);
//响应拦截器
instance.interceptors.response.use(
  config => {
    return config.data;
  },
  err => {
    Toast.fail('网络请求失败!');
    console.log(err);
  }
);
function request(config) {
  return instance(config);
}

export default request;
