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
    method: 'patch',
    data: { nickname },
  });
}

//修改群通知状态
export function changeRemind(gid, remind) {
  return request({
    url: '/member/remind/' + gid,
    method: 'patch',
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

//修改群名称
export function updateGname(gid, gname) {
  return request({
    url: '/group/' + gid + '/gname',
    method: 'patch',
    data: { gname },
  });
}
//修改群简介
export function updateNotice(gid, notice) {
  return request({
    url: '/group/' + gid + '/notice',
    method: 'patch',
    data: { notice },
  });
}

//移除用户
export function removeUser(gid, cid) {
  return request({
    url: `/member/${gid}/user/${cid}`,
    method: 'delete',
  });
}

//退出群聊
export function quit(gid) {
  return request({
    url: '/member/quit/' + gid,
    method: 'delete',
  });
}

//申请加入群聊
export function apply(gid) {
  return request({
    url: `/group/${gid}/apply`,
    method: 'post',
  });
}

//邀请多位好友

export function inviteUsers(gid, users) {
  return request({
    url: `/group/${gid}/invite`,
    method: 'post',
    data: { users },
  });
}

//得到群聊信息相关好友列表
export function getFriend(gid) {
  return request({
    url: `/group/${gid}/friend`,
    method: 'get',
  });
}

//得到用户群申请信息
export function getGroupApplyList() {
  return request({
    url: `/group/applylist`,
    method: 'get',
  });
}
//同意入群
export function agreeGroupApply(gid, inviteecid) {
  return request({
    url: `/group/${gid}/apply/${inviteecid}/agree`,
    method: 'patch',
  });
}
//拒绝入群
export function rejectGroupApply(gid, inviteecid) {
  return request({
    url: `/group/${gid}/apply/${inviteecid}/reject`,
    method: 'patch',
  });
}
//创建群聊
export function createGroup(gname) {
  return request({
    url: `/group/create`,
    method: 'post',
    data: { gname },
  });
}

//解散群聊
export function removeGroup(gid) {
  return request({
    url: `/group/${gid}`,
    method: 'delete',
  });
}
