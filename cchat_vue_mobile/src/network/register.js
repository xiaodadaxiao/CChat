/* 注册相关请求接口 */
import request from './request'

//发送验证码
export function sendCode(email) {
    return request({
        url: '/register/code',
        method: 'post',
        data: {
            email
        }
    })
}
//注册用户请求
export function register(email, code, password) {
    return request({
        url: '/register',
        method: 'post',
        data: {
            email, code, password
        }
    })
}