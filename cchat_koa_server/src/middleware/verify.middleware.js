class VerifyMiddleware {
    //校验邮箱格式
    async verifyEamil(ctx, next) {
        const { email } = ctx.request.body
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (!email || !reg.test(email)) {
            return ctx.app.emit('error', { message: '邮箱格式错误' }, ctx);
        }
        await next()
    }
    //校验密码格式
    async verifyPassword(ctx, next) {
        const { password } = ctx.request.body
        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if (!password || !reg.test(password)) {
            return ctx.app.emit('error', { message: '密码应为6-20位数字和字母' }, ctx);
        }
        await next()
    }
}
module.exports = new VerifyMiddleware()