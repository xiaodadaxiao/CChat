const userService = require('../service/user.service');
class UserMiddleware {
  //根据params 的cid检查用户是否存在
  async checkParamsCid(ctx, next) {
    const { cid } = ctx.request.params;
    try {
      if (!cid) return ctx.app.emit('error', { message: '缺少cid' }, ctx);
      const [userInfo] = await userService.getUserByCid(cid);
      if (!userInfo) return ctx.app.emit('error', { message: '用户不存在' }, ctx);
      //保存用户信息
      ctx.userInfo = userInfo;
      await next();
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '用户不存在' }, ctx);
    }
  }
}

module.exports = new UserMiddleware();
