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

//修改昵称
export function changeName(newName) {
  return request({
    url: '/user/name/' + newName,
    method: 'patch',
  });
}
//修改签名
export function changeSignature(signature) {
  return request({
    url: '/user/signature/' + signature,
    method: 'patch',
  });
}
//修改密码
export function changePassword(oldPassword, newPassword) {
  return request({
    url: '/user/password',
    method: 'patch',
    data: { oldPassword, newPassword },
  });
}
