class AuthController {
    async checkToken(ctx, next) {
        const { cid, exp } = ctx.tokenInfo

        if (ctx.newToken) {
            //需要更新token
            ctx.body = {
                status: 201,
                message: "token有效，即将失效",
                cid,
                token: ctx.newToken
            }

        } else {
            //无需更新token
            ctx.body = {
                status: 200,
                message: 'token有效',
                cid,
                endTime: exp * 1000
            }

        }


    }
}

module.exports = new AuthController()