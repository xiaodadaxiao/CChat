import request from './request';

//请求首页聊天记录
export function getIndexMessage() {
  return request({
    url: '/message/index',
    method: 'get',
  });
}
