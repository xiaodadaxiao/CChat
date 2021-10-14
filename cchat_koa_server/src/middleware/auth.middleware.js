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
    //检查token
    async checkToken(ctx, next) {
        //去掉请求头默认前缀 获得token
        const token = ctx.headers.authorization && ctx.headers.authorization.replace('Bearer ', '');
        if (!token) {
            return ctx.app.emit('error', new Error(errorTypes.NOT_TOKEN), ctx);
        }

        let tokenInfo;
        try {
            tokenInfo = jwt.verify(token, PUBLIC_KEY, {
                algorithms: ['RS256']
            })
        } catch (err) {
            return ctx.app.emit('error', { message: "token无效" }, ctx)
        }
        //{ cid: '10000', iat: 1634216295, exp: 1634216355 }// 秒 
        ctx.cid = tokenInfo.cid;
        ctx.tokenInfo = tokenInfo
        await next()
    }
}
module.exports = new AuthMiddleware()