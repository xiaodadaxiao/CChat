const messageService = require('../service/message.service');
const friendService = require('../service/friend.service');
const memberService = require('../service/member.service');
class MessageController {
  //得到首页信息
  async getIndexMessage(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    try {
      const friendMessages = await messageService.getFriendMessage(cid);
      const groupMessage = await messageService.getGroupMessage(cid);
      /* 处理数据 */
      const data = [];
      if (friendMessages.length > 0) {
        for (let f of friendMessages) {
          const [result] = await messageService.getFriendUnreadCount(cid, f.friend_cid, f.last_time);

          f.count = result.count || 0;
          data.push({
            type: 'friend',
            data: f,
          });
        }
      }
      if (groupMessage.length) {
        for (let g of groupMessage) {
          const [result] = await messageService.getGroupUnreadCount(g.gid, g.last_time);
          g.count = result.count || 0;
          data.push({
            type: 'group',
            data: g,
          });
        }
      }
      //按更新时间排序
      data.sort((a, b) => b.data.updateAt - a.data.updateAt);
      ctx.body = { status: 200, data };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '查询失败' }, ctx);
    }
  }

  //得到好友聊天信息
  async getFriendMessage(ctx, next) {
    const friendCid = ctx.friendInfo.friend_cid;
    const userCid = ctx.tokenInfo.cid;

    const { offset, size } = ctx.request.query;

    try {
      const data = await messageService.getFriendMessageByCid(userCid, friendCid, offset, size);
      const [countResult] = await messageService.getFriendMessageCountByCid(userCid, friendCid);
      ctx.body = { status: 200, count: countResult.count, data };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '请求聊天信息失败' }, ctx);
    }
  }
  //得到群聊天信息
  async getGroupMessage(ctx, next) {
    const gid = ctx.memberInfo.gid;
    const { offset, size } = ctx.request.query;
    try {
      const data = await messageService.getGroupMessageByGid(gid, offset, size);
      const [countResult] = await messageService.getGroupMessageCountByGid(gid);
      ctx.body = { status: 200, count: countResult.count, data };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '请求聊天信息失败' }, ctx);
    }
  }

  //删除好友聊天记录（修改delete_time）
  async removeFriendMessage(ctx, next) {
    try {
      const friendCid = ctx.request.params.cid;
      const cid = ctx.tokenInfo.cid;
      await friendService.updateFriendByKeyValue(cid, friendCid, 'delete_time', new Date());
      ctx.body = { status: 200, message: '删除成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '删除好友信息失败' }, ctx);
    }
  }
  //删除群聊天记录（修改delete_time）
  async removeGroupMessage(ctx, next) {
    try {
      const gid = ctx.request.params.gid;
      const cid = ctx.tokenInfo.cid;
      await memberService.updateMemberByKeyValue(cid, gid, 'delete_time', new Date());
      ctx.body = { status: 200, message: '删除成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '删除群信息失败' }, ctx);
    }
  }
}
module.exports = new MessageController();
