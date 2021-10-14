class AuthController {
    async checkToken(ctx, next) {
        const tokenInfo = ctx.tokenInfo
        ctx.body = {
            status: 200,
            message: 'token有效',
            cid: tokenInfo.cid,
            //startTime: tokenInfo.iat * 1000,//毫秒
            endTime: tokenInfo.exp * 1000
        }
    }
}

module.exports = new AuthController()