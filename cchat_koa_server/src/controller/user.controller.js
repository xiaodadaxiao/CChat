const userService = require('../service/user.service');
const friendService = require('../service/friend.service');
const userTypes = require('../constant/user.constant');
const frinedTypes = require('../constant/friend.constant');
const Val = require('../utils/validator');
const { setMD5 } = require('../utils/crypto');
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
          state: friendInfo.state,
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

  //修改昵称
  async updateName(ctx, name) {
    try {
      const cid = ctx.tokenInfo.cid;
      const newName = ctx.request.params.name;
      if (!new Val(newName).len(1, 30).end()) {
        return ctx.app.emit('error', { message: '昵称长度应为1-30' }, ctx);
      }
      await userService.updateByKeyValue(cid, 'name', newName);
      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '修改昵称错误' }, ctx);
    }
  }

  //修改签名
  async updateSignature(ctx, name) {
    try {
      const cid = ctx.tokenInfo.cid;
      const signature = ctx.request.params.signature;
      console.log(cid, signature);
      if (!new Val(signature).len(1, 50).end()) {
        return ctx.app.emit('error', { message: '签名长度应为1-50' }, ctx);
      }
      await userService.updateByKeyValue(cid, 'signature', signature);
      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '修改签名错误' }, ctx);
    }
  }
  //修改密码
  async updatePassword(ctx, name) {
    try {
      const cid = ctx.tokenInfo.cid;
      const { newPassword, oldPassword } = ctx.request.body;
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
      const vo = new Val(oldPassword).notnull().len(6, 50).reg(reg).end();
      const vn = new Val(newPassword).notnull().len(6, 50).reg(reg).end();
      if (!vo || !vn) {
        return ctx.app.emit('error', { message: '密码至少为6位英文和字母' }, ctx);
      }
      //查询信息
      const [userInfo] = await userService.getUserByCid(cid);
      if (!userInfo) return ctx.app.emit('error', { message: '用户不存在' }, ctx);
      //密码对比
      if (setMD5(oldPassword) !== userInfo.password) return ctx.app.emit('error', { message: '密码错误' }, ctx);
      const password = setMD5(newPassword);
      await userService.updateByKeyValue(cid, 'password', password);
      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '修改签名错误' }, ctx);
    }
  }
}
module.exports = new UserController();
