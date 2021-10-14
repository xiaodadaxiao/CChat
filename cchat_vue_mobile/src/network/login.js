/* 登录相关请求接口 */
import request from './request'

//登录
export function login(cid, password) {
    return request({
        url: '/login',
        method: 'post',
        data: {
            cid, password
        }
    })
}