import request from './request';

//请求好友消息列表
export function getFriendMessage(friendCid, offset = 0, size = 10) {
  return request({
    url: '/message/friend/' + friendCid,
    method: 'get',
    params: { offset, size },
  });
}
//请求群消息列表
export function getGroupMessage(gid, offset = 0, size = 10) {
  return request({
    url: '/message/group/' + gid,
    method: 'get',
    params: { offset, size },
  });
}

//删除群消息列表
export function deleteGroupMessage(gid) {
  return request({
    url: '/message/group/' + gid,
    method: 'delete',
  });
}
//删除好友消息列表
export function deleteFriendMessage(friendCid) {
  return request({
    url: '/message/friend/' + friendCid,
    method: 'delete',
  });
}
