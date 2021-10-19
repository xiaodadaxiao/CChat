const userService = require('../service/user.service');
const memberService = require('../service/member.service');
const groupTypes = require('../constant/group.constant');
const memberTypes = require('../constant/member.constant');
//处理数据
function handleUserInfo(info) {
  if (Array.isArray(info)) {
    let arr = [];
    info.forEach(item => {
      arr.push({ cid: item.cid, name: item.name, avatarUrl: item.avatar_url });
    });
    return arr;
  } else {
    return { cid: info.cid, name: info.name, avatarUrl: info.avatar_url };
  }
}
class GroupController {
  //搜索群
  async search(ctx, next) {
    ctx.body = { status: 200, message: '成功' };
  }

  //查看群信息
  async getInfo(ctx, next) {
    const groupInfo = ctx.groupInfo;
    const { gid, gname, notice, leader_cid: leaderCid, avatar_url: avatarUrl } = groupInfo;
    const { cid } = ctx.tokenInfo;
    try {
      /* 
       一、查询群基础信息
      */
      //查询群主信息
      let [leaderInfo] = await userService.getUserByCid(leaderCid);
      leaderInfo = handleUserInfo(leaderInfo);
      //查询成员数量
      const [{ count }] = await memberService.getMemberCountByGid(gid);
      //查询前五个成员的用户信息
      let members = await memberService.getMembersUserInfoByGid(gid, '0', '5');
      members = handleUserInfo(members);
      /* 
        二、查询用户与群关系
      */
      //查询群和用户
      let type = '',
        info = {};
      const [result] = await memberService.getOneMember(gid, cid);
      if (result) info = { nickname: result.nickname, role: result.role, remind: result.remind };
      //群主
      if (result && result.role == memberTypes.USER_ROLE_LEADER) type = groupTypes.RELATION_LEADER;
      //普通成员
      if (result && result.role == memberTypes.USER_ROLE_NORMAL) type = groupTypes.RELATION_JOIN;
      //未加入
      if (!result) type = groupTypes.RELATION_STRANGER;
      /* 要返回的信息 */
      ctx.body = {
        status: 200,
        relation: { type, info },
        groupInfo: { gid, gname, notice, leaderCid, avatarUrl, members, count, leaderInfo },
      };
    } catch (error) {
      console.log(error);
      ctx.ap.emit('error', { message: '查询群信息失败' }, ctx);
    }
  }
}
module.exports = new GroupController();
