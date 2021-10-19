const groupService = require('../service/group.service');
class GroupMiddleware {
  async checkParamGid(ctx, next) {
    const gid = ctx.request.params.gid;
    try {
      if (!gid) return ctx.app.emit('error', { message: '没有gid' }, ctx);
      //查询群信息
      const [groupInfo] = await groupService.getGroupByGid(gid);
      if (!groupInfo) return ctx.app.emit('error', { message: '没有群信息' }, ctx);
      ctx.groupInfo = groupInfo;
      await next();
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '检查群gid失败' }, ctx);
    }
  }
}

module.exports = new GroupMiddleware();
