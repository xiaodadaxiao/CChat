import axios from 'axios';
import { baseURL } from '@/common/config';
//axios实例
const instance = axios.create({
  baseURL,
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
    //最后传递处理后的数据
    return config;
  },
  err => {
    console.log(err);
  }
);
//响应拦截器
instance.interceptors.response.use(
  config => {
    return config.data;
  },
  err => {
    console.log(err);
  }
);
function request(config) {
  return instance(config);
}

export default request;
