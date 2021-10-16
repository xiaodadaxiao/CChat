/* 用户相关网络请求 */
import request from './request'

export function getFriendList(cid) {
    return request({
        url: '/friend/list',
        method: 'get'
    })
}