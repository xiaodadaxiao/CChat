import request from './request';
//根据cid查询用户是否存在
export function searchUser(cid) {
  return request({
    url: '/user/search/' + cid,
    method: 'get',
  });
}

//查询用户信息
export function getUserInfo(cid) {
  return request({
    url: 'user/info/' + cid,
    method: 'get',
  });
}
