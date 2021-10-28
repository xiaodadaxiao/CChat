const userService = require('../service/user.service');
const friendService = require('../service/friend.service');
const userTypes = require('../constant/user.constant');
const frinedTypes = require('../constant/friend.constant');
class UserController {
  //查询用户是否存在
  async search(ctx, next) {
    ctx.body = {
      status: 200,
      userInfo: ctx.userInfo,
      cid: ctx.userInfo.cid,
    };
  }
  //查询用户信息
  async getUserInfo(ctx, name) {
    const userInfo = ctx.userInfo;
    const tokenInfo = ctx.tokenInfo;
    try {
      //返回的信息
      const res = {
        status: 200,
        relation: {},
        userInfo: {
          cid: userInfo.cid,
          name: userInfo.name,
          avatarUrl: userInfo['avatar_url'],
          signature: userInfo.signature,
        },
      };
      /* 情况一：自己本人 */
      if (userInfo.cid == tokenInfo.cid) {
        res.relation.type = userTypes.RELATION_OWN;
        return (ctx.body = res);
      }
      //查询好友关系
      const [friendInfo] = await friendService.getFriendByCid(tokenInfo.cid, userInfo.cid);
      /* 情况二：该用户是好友 */
      if (friendInfo) {
        res.relation.type = userTypes.RELATION_FRIEND;
        res.relation.info = {
          nickname: friendInfo['nickname'],
          lastTime: friendInfo['last_time'],
        };
        return (ctx.body = res);
      }
      //查询申请情况
      const [applyInfo] = await friendService.getApplyByUserAndFriend(tokenInfo.cid, userInfo.cid);
      /* 情况三、四：正在添加 */
      if (applyInfo && applyInfo.state == frinedTypes.APPLY_WAITING) {
        //该用户正在添加我  或者  正在添加该用户
        res.relation.type = applyInfo['user_cid'] == userInfo.cid ? userTypes.RELATION_ADDING_ME : userTypes.RELATION_ME_ADDING;
        res.relation.info = {
          time: applyInfo['updateAt'],
          message: applyInfo['message'],
        };
        return (ctx.body = res);
      }
      /* 情况五 陌生人 */
      res.relation.type = userTypes.RELATION_STRANGER;
      return (ctx.body = res);
    } catch (error) {
      ctx.app.emit('error', { message: '请求用户信息失败' }, ctx);
    }
  }
}
module.exports = new UserController();
