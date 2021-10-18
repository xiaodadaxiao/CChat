const friendService = require('../service/friend.service');
class FriendMiddleware {
  //获得好友列表
  async getList(ctx, next) {
    const { cid } = ctx.tokenInfo;
    console.log(cid);
    await next();
  }
  //获得请求信息【 params】
  async checkApplyParamsToToken(ctx, next) {
    try {
      const userCid = ctx.request.params.cid;
      const cid = ctx.tokenInfo.cid;

      if (!userCid) return ctx.app.emit('error', { message: '缺少好友cid' }, ctx);
      //查询信息 param cid 给token cid 发的好友请求
      const [applyInfo] = await friendService.getApplyByToAndFrom(cid, userCid);
      if (!applyInfo) return ctx.app.emit('error', { message: '没有申请好友的请求' }, ctx);
      ctx.applyInfo = applyInfo;
      await next();
    } catch (error) {
      console.log(error);
      ctx.app.emlt('error', { message: '请求好友申请信息失败' }, ctx);
    }
  }
}

module.exports = new FriendMiddleware();
