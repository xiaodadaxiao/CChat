/* 登录 */

class LoginController {
    async login(ctx, next) {
        ctx.body = {
            status: 200,
            token: ctx.token,
            message: "登录成功"
        }
    }
}

module.exports = new LoginController()