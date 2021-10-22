/* 用户相关网络请求 */
import request from './request';

//获取好友列表
export function getFriendList() {
  return request({
    url: '/friend/list',
    method: 'get',
  });
}

//请求申请列表
export function getFriendApplyList() {
  return request({
    url: '/friend/apply',
    method: 'get',
  });
}

//请求添加用户好友
export function addFriendApply(cid, message) {
  return request({
    url: '/friend/apply/' + cid,
    method: 'post',
    data: {
      message,
    },
  });
}

//同意 添加好友请求
export function agreeApply(cid) {
  return request({
    url: '/friend/agree/' + cid,
    method: 'post',
  });
}
//拒绝 添加好友请求
export function rejectApply(cid) {
  return request({
    url: '/friend/reject/' + cid,
    method: 'post',
  });
}
