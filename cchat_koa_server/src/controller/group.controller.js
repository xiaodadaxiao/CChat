const userService = require('../service/user.service');
const memberService = require('../service/member.service');
const groupTypes = require('../constant/group.constant');
const memberTypes = require('../constant/member.constant');
const groupService = require('../service/group.service');
const Val = require('../utils/validator');
const friendService = require('../service/friend.service');
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
  //更新群名称
  async updateGname(ctx, name) {
    try {
      const gname = ctx.request.body.gname;
      const gid = ctx.groupInfo.gid;
      if (!gname || gname.length > 30 || gname.length == '') return ctx.app.emit('error', { message: '参数错误' }, ctx);
      await groupService.updateGroupByKeyValue(gid, 'gname', gname);

      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '修改群名称失败' }, ctx);
    }
  }
  //更新群简介
  async updateNotice(ctx, name) {
    try {
      const notice = ctx.request.body.notice;
      const gid = ctx.groupInfo.gid;
      if (!notice || notice.length > 200 || notice.length == '') return ctx.app.emit('error', { message: '参数错误' }, ctx);
      await groupService.updateGroupByKeyValue(gid, 'notice', notice);

      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '修改群简介失败' }, ctx);
    }
  }

  //添加群邀请
  async addInvite(ctx, next) {
    const users = ctx.request.body.users;
    const gid = ctx.request.params.gid;
    const { cid } = ctx.tokenInfo;
    try {
      if (!new Val(users).notnull().array().end()) return ctx.app.emit('error', { message: 'users参数必须为非空数组' }, ctx);
      let applyCount = 0;
      for (let i = 0; i <= users.length; i++) {
        if (i == users.length) {
          ctx.body =
            applyCount == users.length
              ? { status: 200, message: '添加完成' }
              : { status: 201, message: '部分添加完成', applyCount };
          return;
        }
        let userCid = users[i];
        //查询用户cid是否存在
        const [userInfo] = await userService.getUserByCid(userCid);
        if (!userInfo) continue;
        //查询是否在群
        const [member] = await memberService.getOneMember(gid, userCid);
        if (member) continue;
        //查询是否有申请
        const [applyInfo] = await groupService.getApply(gid, null, userCid);
        if (applyInfo) {
          await groupService.updateApply(gid, cid, userCid, memberTypes.APPLY_WAITING);
        } else {
          await groupService.addApply(gid, cid, userCid);
        }
        applyCount++;
      }
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '添加错误' }, ctx);
    }
  }

  //申请入群
  async apply(ctx, next) {
    const gid = ctx.request.params.gid;
    const { cid } = ctx.tokenInfo;
    try {
      const [member] = await memberService.getOneMember(gid, cid);
      if (member) return ctx.app.emit('error', { message: '已在群聊，不能重复加入' }, ctx);
      //查询申请
      const [result] = await groupService.getApply(gid, null, cid);
      if (result) {
        //修改申请
        await groupService.updateApply(gid, cid, cid, memberTypes.APPLY_WAITING);
      } else {
        await groupService.addApply(gid, cid, cid);
      }
      ctx.body = { status: 200, message: '添加申请成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '添加申请失败' }, ctx);
    }
  }

  //获取好友列表（关于群）
  async getFriendByGroup(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const gid = ctx.request.params.gid;
    try {
      const list = await friendService.getFriendListByCid(cid);
      if (!new Val(list).array().notnull().end()) return (ctx.body = { status: 201, message: '没有好友', data: list });
      const data = [];
      for (let friend of list) {
        const [info] = await memberService.getOneMember(gid, friend.cid);
        let isInGroup = info !== undefined;
        data.push({
          cid: friend.cid,
          name: friend.name,
          nickname: friend.nickname,
          avatarUrl: friend.avatar_url,
          isInGroup,
        });
      }
      ctx.body = { status: 200, data };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '请求错误' }, ctx);
    }
  }
  //获得群申请列表
  async getApplyList(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    //获取群申请
    try {
      const applyList = await groupService.getApplyListByLeaderCid(cid);
      if (applyList.length <= 0) return (ctx.body = { status: 201, applyList, message: '请求为空' });
      //获得邀请者和申请者信息
      const data = [];
      applyList.forEach(a => {
        data.push({
          gid: a.gid,
          gname: a.gname,
          applyId: a.apply_id,
          inviterCid: a.inviter_cid,
          inviteeCid: a.invitee_cid,
          state: a.state,
          inviteeAvatarUrl: a.invitee_avatar_url,
          inviteedName: a.invitee_name,
        });
      });
      ctx.body = { status: 200, data };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '请求群申请列表失败' }, ctx);
    }
  }
  //同意群申请
  async agreeApply(ctx, next) {
    const { inviteecid, gid } = ctx.request.params;
    const cid = ctx.tokenInfo.cid;
    try {
      //查找是否存在申请
      const [applyInfo] = await groupService.getApply(gid, null, inviteecid);
      if (!applyInfo) return ctx.app.emit('error', { message: '没有申请信息' }, ctx);
      //查询用户信息
      const [userInfo] = await userService.getUserByCid(inviteecid);
      if (!userInfo) return ctx.app.emit('error', { message: '用户不存在' }, ctx);

      //将状态更改为同意
      await groupService.updateApply(gid, applyInfo.inviter_cid, inviteecid, memberTypes.APPLY_ACCEPTED);
      //查询是否已经在群
      const [memberInfo] = await memberService.getOneMember(gid, inviteecid);
      if (memberInfo) return ctx.app.emit('error', { message: '用户不能重复入群' }, ctx);
      //创建群用户信息
      await memberService.addMember(gid, inviteecid, userInfo.name, memberTypes.USER_ROLE_NORMAL);
      ctx.body = { status: 200, message: '加入成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '更改申请失败' }, ctx);
    }
  }
  //拒绝群申请
  async rejectApply(ctx, next) {
    const { inviteecid, gid } = ctx.request.params;
    const cid = ctx.tokenInfo.cid;
    try {
      //查找是否存在申请
      const [applyInfo] = await groupService.getApply(gid, null, inviteecid);
      if (!applyInfo) return ctx.app.emit('error', { message: '没有申请信息' }, ctx);
      //查询用户信息
      const [userInfo] = await userService.getUserByCid(inviteecid);
      if (!userInfo) return ctx.app.emit('error', { message: '用户不存在' }, ctx);
      //将状态更改为拒绝
      await groupService.updateApply(gid, applyInfo.inviter_cid, inviteecid, memberTypes.APPLY_REJECTED);
      ctx.body = { status: 200, message: '拒绝成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '更改申请失败' }, ctx);
    }
  }

  //创建群
  async create(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const gname = ctx.request.body.gname;
    try {
      const flag = new Val(gname).notnull().string().maxlen(30).end();
      if (!flag) return ctx.app.emit('error', { message: '群名参数错误' }, ctx);
      //得到群gid
      const [gidInfo] = await groupService.getOneGid();
      if (!gidInfo) return ctx.app.emit('error', { message: '群号不足' }, ctx);
      //修改gid状态
      await groupService.updateGidState(gidInfo.gid, 1);
      //创建群聊
      const avatarUrl = 'https://uploadfile.bizhizu.cn/2015/0416/20150416105223384.jpg';
      const notice = `群主很懒，没有留下什么`;
      await groupService.create(gidInfo.gid, gname, cid, notice, avatarUrl);
      //群主加入群聊
      await memberService.addMember(gidInfo.gid, cid, '群主' + cid, memberTypes.USER_ROLE_LEADER);
      ctx.body = { status: 200, message: '创建成功！', gid: gidInfo.gid, gname };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '创建群聊失败' }, ctx);
    }
  }

  //解散群聊
  async remove(ctx, next) {
    const gid = ctx.request.params.gid;
    try {
      //解散
      await groupService.remove(gid);
      ctx.body = { status: 200, message: '解散成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '解散失败' }, ctx);
    }
  }
}
module.exports = new GroupController();
