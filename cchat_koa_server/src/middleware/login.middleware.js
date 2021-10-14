const userService = require('../service/user.service')
const { setMD5 } = require('../utils/crypto')
class LoginMiddleware {
    async checkLogin(ctx, next) {
        let { cid, password } = ctx.request.body;
        try {
            if (!cid) return ctx.app.emit('error', { message: '没有cid' }, ctx);
            const [user] = await userService.getUserByCid(cid);
            if (!user) return ctx.app.emit('error', { message: '用户不存在', status: 401 }, ctx);
            //加密对比密码
            password = setMD5(password);
            if (password !== user.password) {
                return ctx.app.emit('error', { message: 'CID或密码错误' }, ctx);
            }
            await next();
        } catch (error) {
            console.log(error);
            return ctx.app.emit('error', { message: '检查用户登录信息失败' }, ctx);
        }

    }
}

module.exports = new LoginMiddleware()