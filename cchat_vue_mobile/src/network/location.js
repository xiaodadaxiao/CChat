/* 地理位置相关网络请求 */
import request from './request';
import { baiduMapKey } from '@/common/config';
//获取地理位置信息
// export function getLocation({ lat, lng }) {
//   return axios({
//     url: `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${baiduMapKey}&output=json&coordtype=wgs84ll&location=${lat},${lng}`,
//     method: 'get',
//   });
// }
export function getLocation({ lat, lng }) {
  return request({
    url: '/location/inversecoding',
    method: 'get',
    params: { baiduMapKey, lat, lng },
  });
}
