const { getUserByEmail } = require('../service/user.service')
const { getRegisterByEmail } = require('../service/register.service')
class RegisterMiddleware {
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
    //校验用户是否存在
    async checkHasUser(ctx, next) {
        try {
            const { email } = ctx.request.body
            const user = await getUserByEmail(email);
            if (user.length > 0) throw new Error()
            await next()
        } catch (error) {
            console.log(error);
            return ctx.app.emit('error', { status: 201, message: '用户已存在' }, ctx);
        }
    }
    //校验验证码是否失效
    async checkCodeExpire(ctx, next) {
        const { email } = ctx.request.body
        try {
            const [register] = await getRegisterByEmail(email);
            //有效期还没过
            if (register && register['end_time'] >= Date.now()) {
                return ctx.app.emit('error', { status: 202, message: '验证码未过期', endTime: register['end_time'] }, ctx)
            }
            //传递参数
            if (register) {
                ctx.register = register;
            }
            await next()
        } catch (error) {
            console.log(error);
            return ctx.app.emit('error', {}, ctx)
        }
    }
    //校验验证码是否有效
    async checkCode(ctx, next) {
        try {
            const { email, code } = ctx.request.body;
            const [register] = await getRegisterByEmail(email);
            if (!register) return ctx.app.emit('error', { message: '验证码不存在', status: 401 }, ctx)
            //查看验证码时间
            if (register['end_time'] <= Date.now()) {
                return ctx.app.emit('error', { message: '验证码已过期', status: 401 }, ctx)
            }
            //判断验证码是否正确
            if (register.code !== code) {
                return ctx.app.emit('error', { message: '验证码不正确', status: 402 }, ctx)
            }
            await next()
        } catch (error) {
            console.log(error);
            return ctx.app.emit('error', { message: '验证码校验失败' }, ctx)
        }


    }

}

module.exports = new RegisterMiddleware()