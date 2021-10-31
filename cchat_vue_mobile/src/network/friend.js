/* 用户相关网络请求 */
import request from './request';

//获取好友列表
export function getFriendList() {
  return request({
    url: '/friend/list',
    method: 'get',
  });
}

//获取好友信息
export function getFriendInfo(friendCid) {
  return request({
    url: `/friend/${friendCid}/info`,
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

//删除好友
export function deleteFriend(friendCid) {
  return request({
    url: '/friend/' + friendCid,
    method: 'delete',
  });
}

//修改好友备注
export function changeNickname(friendCid, nickname) {
  return request({
    url: `/friend/${friendCid}/nickname`,
    method: 'patch',
    data: { nickname },
  });
}
//好友加入黑名单
export function backlist(friendCid) {
  return request({
    url: `/friend/${friendCid}/backlist`,
    method: 'post',
  });
}

//好友移出黑名单
export function removeBacklist(friendCid) {
  return request({
    url: `/friend/${friendCid}/backlist`,
    method: 'delete',
  });
}

//得到黑名单列表
export function getBacklist() {
  return request({
    url: `/friend/backlist`,
    method: 'get',
  });
}
