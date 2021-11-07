const registerService = require('../service/register.service');
const userService = require('../service/user.service');
const { setMD5 } = require('../utils/crypto');
const sendEaiml = require('../utils/sendEmail');
class RegisterController {
  async create(ctx, next) {
    let { email, password } = ctx.request.body;
    try {
      //得到可用号码
      const result = await registerService.getOneCid();
      //生成用户信息
      const cid = result.cid;
      const name = '用户' + cid;
      password = setMD5(password);
      const url = 'https://z3.ax1x.com/2021/11/07/I1SxNd.png';
      //创建用户
      await userService.create(email, cid, name, password, url);
      //更改cid池为已注册
      await registerService.setCidToRegister(cid);
      ctx.body = {
        status: 200,
        message: '注册成功',
        cid,
        name,
        email,
      };
    } catch (error) {
      console.log(error);
      return ctx.app.emit('error', { message: '注册失败' }, ctx);
    }
  }
  async sendCode(ctx, next) {
    const { email } = ctx.request.body;
    try {
      //生成随机验证码
      let code = '';
      for (let i = 0; i <= 5; i++) {
        code += Math.round(Math.random() * 10).toString();
      }
      //生成有效时间(十分钟)
      let endTime = Date.now() + 1000 * 60 * 10;
      endTime = new Date(endTime);
      //发送邮件
      const result = await sendEaiml(email, code);
      //更新到数据库
      if (ctx.register) {
        await registerService.update(email, code, endTime);
      } else {
        await registerService.create(email, code, endTime);
      }

      //响应客户端
      ctx.body = { status: 200, endTime, message: '生成验证码成功' };
    } catch (error) {
      console.log('捕获发送邮件错误：');
      console.log(error);
      return ctx.app.emit('error', { message: '发送验证码错误' }, ctx);
    }
  }
}
module.exports = new RegisterController();
