/* 群相关网络请求 */
import request from './request';

export function getGroupInfo(gid) {
  return request({
    url: '/group/info/' + gid,
    method: 'get',
  });
}

//获取群用户
export function getMemberList(gid) {
  return request({
    url: '/member/list/' + gid,
    method: 'get',
  });
}

//修改群昵称
export function changeNickname(gid, nickname) {
  return request({
    url: '/member/nickname/' + gid,
    method: 'post',
    data: { nickname },
  });
}

//修改群通知状态
export function changeRemind(gid, remind) {
  return request({
    url: '/member/remind/' + gid,
    method: 'post',
    data: { remind },
  });
}

//获取群聊列表
export function getGroupList() {
  return request({
    url: '/member/list',
    method: 'get',
  });
}

//搜索群
export function searchGroup(gid) {
  return request({
    url: '/group/search/' + gid,
    method: 'get',
  });
}
