const memberService = require('../service/member.service');
class MemberMiddleware {
  //检查用户是否在群中
  async checkInsideByParamGid(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const gid = ctx.request.params.gid;
    if (!cid || !gid) return ctx.app.emit('error', { message: '没有gid或cid' }, ctx);
    try {
      const [memberInfo] = await memberService.getOneMember(gid, cid);
      if (!memberInfo) return ctx.app.emit('error', { message: '没有权限查看群聊' }, ctx);
      ctx.memberInfo = memberInfo;
      await next();
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '检查群聊权限错误' }, ctx);
    }
  }
}
module.exports = new MemberMiddleware();
