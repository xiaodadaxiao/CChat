const groupService = require('../service/group.service');
const memberTypes = require('../constant/member.constant');

class GroupMiddleware {
  //查询群是否存在
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

  //检查操作群权限
  async checkAdmin(ctx, next) {
    //前面中间件传递的信息
    const memberInfo = ctx.memberInfo;
    try {
      //不是群主
      if (memberInfo.role !== memberTypes.USER_ROLE_LEADER) {
        return ctx.app.emit('error', { message: '权限不足' }, ctx);
      }
      await next();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new GroupMiddleware();
