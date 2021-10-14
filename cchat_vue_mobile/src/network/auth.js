/* 权限相关请求接口 */
import request from './request'

//判断token
export function checkToken() {
    return request({
        url: '/auth/token',
        method: 'post',
    })
}