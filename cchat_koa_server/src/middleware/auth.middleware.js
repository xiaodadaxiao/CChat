/* 权限相关中间件 */

//导入公钥和私钥
const { PUBLIC_KEY, PRIVATE_KEY } = require('../config')

const jwt = require('jsonwebtoken')
class AuthMiddleware {
    //生成token
    async createToken(ctx, next) {
        const { cid } = ctx.request.body
        //生成token 私钥签名
        const token = jwt.sign({ cid }, PRIVATE_KEY, {
            expiresIn: 60 * 60,//有效时间，单位秒
            algorithm: 'RS256',//算法
        })
        ctx.token = token
        await next();
    }
}
module.exports = new AuthMiddleware()