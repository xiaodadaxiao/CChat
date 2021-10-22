const memberService = require('../service/member.service');
class MemberController {
  //获取群用户
  async getList(ctx, next) {
    const gid = ctx.request.params.gid;
    try {
      const result = await memberService.getMembersUserInfoByGid(gid);
      const data = [];
      result.forEach(item => {
        data.push({
          cid: item.cid,
          name: item.name,
          nickname: item.nickname,
          state: item.state,
          role: item.role,
          avatarUrl: item.avatar_url,
        });
      });
      ctx.body = {
        status: 200,
        message: '获取成功',
        data,
      };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '获取列表失败' }, ctx);
    }
  }

  //修改昵称
  async changeNickname(ctx, next) {
    const gid = ctx.request.params.gid;
    const cid = ctx.tokenInfo.cid;
    try {
      const nickname = ctx.request.body.nickname;
      if (!nickname || nickname.length > 20 || nickname.length == '') return ctx.emit('error', { message: '昵称不合规' }, ctx);
      await memberService.updateNickname(gid, cid, nickname);
      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.emit('error', { message: '修改昵称失败' }, ctx);
    }
  }

  //修改接收通知
  async changeRemind(ctx, next) {
    const gid = ctx.request.params.gid;
    const cid = ctx.tokenInfo.cid;
    try {
      const isRemind = ctx.request.body.remind;
      if (typeof isRemind !== 'boolean') return ctx.emit('error', { message: '参数不合规' }, ctx);
      await memberService.updateRemind(gid, cid, isRemind);
      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.emit('error', { message: '修改接收通知失败' }, ctx);
    }
  }

  //获取用户的群聊
  async getGroupList(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    try {
      //获取群聊列表
      const groupList = await memberService.getGroupListByCid(cid);
      const data = [];
      groupList.forEach(item => {
        data.push({
          gid: item.gid,
          gname: item.gname,
          lastTime: item.last_time,
          avatarUrl: item.avatar_url,
          role: item.role,
          remind: item.remind,
        });
      });
      ctx.body = {
        status: 200,
        data,
      };
    } catch (error) {
      console.log(error);
    }
  }

  //移除群用户
  async removeUser(ctx, next) {
    const adminCid = ctx.tokenInfo.cid;
    const { gid, cid: userCid } = ctx.request.params;

    try {
      if (adminCid === userCid) return ctx.app.emit('error', { message: '不能移除自己' }, ctx);
      //查询用户是否在群
      const [result] = await memberService.getOneMember(gid, userCid);
      if (!result) return ctx.app.emit('error', { message: '该用户不在群聊' }, ctx);
      //移除
      await memberService.removeUserByCid(gid, userCid);

      ctx.body = { status: 200, message: '移除成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '移除用户失败' }, ctx);
    }
  }

  //退出群聊
  async quit(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const gid = ctx.request.params.gid;
    try {
      if (ctx.groupInfo['leader_cid'] == cid) return ctx.app.emit('error', { message: '群主无法退出群聊' }, ctx);
      await memberService.removeUserByCid(gid, cid);
      ctx.body = { status: 200, message: '退出成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '退出群聊错误' }, ctx);
    }
  }
}
module.exports = new MemberController();
