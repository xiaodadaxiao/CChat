const friendService = require('../service/friend.service');
const frinendTypes = require('../constant/friend.constant');
const pinyin = require('pinyin');
const userService = require('../service/user.service');
//处理好友数据
function handleFriendData(friend) {
  return {
    friendCid: friend['friend_cid'],
    nickname: friend['nickname'],
    lastTime: friend['last_time'],
    state: friend['state'],
    avatarUrl: friend['avatar_url'],
    friendName: friend['name'],
  };
}
class FriendCotroller {
  //获取好友列表
  async getList(ctx, next) {
    const { cid } = ctx.tokenInfo;
    try {
      const result = await friendService.getFriendListByCid(cid);
      if (result.length <= 0) {
        ctx.body = {
          status: 201,
          message: '没有好友',
          data: result,
        };
      }
      //索引排序
      const data = {};
      result.forEach(friend => {
        //获取用户昵称首文字
        const firstWord = friend.nickname.slice(0, 1);
        //将首文字转字母（返回二维数组）
        let [[code]] = pinyin(firstWord, {
          segment: false,
          style: pinyin.STYLE_FIRST_LETTER,
        });
        if (/[a-z]/.test(code)) {
          //属于字母
          code = code.toUpperCase(); //大写
          if (!data[code]) {
            data[code] = [];
          }
          data[code].push(handleFriendData(friend));
        } else {
          //其他符号
          if (!data['#']) {
            data['#'] = [];
          }
          data['#'].push(handleFriendData(friend));
        }
      });
      ctx.body = {
        status: 200,
        data,
      };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '获取好友列表失败' });
    }
  }

  //获取好友申请列表
  async getApplyList(ctx, next) {
    const { cid } = ctx.tokenInfo;
    try {
      //获取申请中的请求列表
      const list = await friendService.retrieveApplyList(cid, frinendTypes.APPLY_WAITING);
      const data = [];
      list.forEach(item => {
        data.push({
          cid: item.cid,
          name: item.name,
          avatarUrl: item.avatar_url,
          message: item.message,
        });
      });
      ctx.body = { status: 200, data };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '获取申请列表失败' });
    }
  }

  //添加好友申请请求
  async createApply(ctx, next) {
    try {
      const cid = ctx.tokenInfo.cid;
      const userCid = ctx.userInfo.cid;
      if (cid === userCid) return ctx.app.emit('error', { message: '不能添加自己为好友' }, ctx);
      //申请消息
      let message = ctx.request.body.message || null;
      /* 查询是否已经有好友信息 */
      const [friendResult] = await friendService.getFriendByCid(cid, userCid);
      if (friendResult) return ctx.app.emit('error', { message: '好友不能重复添加' }, ctx);

      /* 查询是否有申请记录 */
      const [applyResult] = await friendService.getApplyByUserAndFriend(cid, userCid);
      //正在添加
      if (applyResult && applyResult.state == frinendTypes.APPLY_WAITING) {
        return ctx.app.emit('error', { message: '不能重复申请添加好友' }, ctx);
      }
      //黑名单
      if (applyResult && applyResult.state == frinendTypes.APPLY_BLACKLIST) {
        return ctx.app.emit('error', { message: '对方已把你拉黑' }, ctx);
      }
      //已拒绝（更新为等待状态）
      if (applyResult && applyResult.state == frinendTypes.APPLY_REJECTED) {
        //更改为请求状态
        await friendService.updateApplyStateById(applyResult.id, frinendTypes.APPLY_WAITING);
        //更改请求信息
        await friendService.updateApplyMessageById(applyResult.id, message);
        return (ctx.body = {
          status: 200,
          message: '添加申请成功',
        });
      }

      /* 创建 好友申请记录 */
      await friendService.createApply(cid, userCid, message);
      ctx.body = {
        status: 200,
        message: '添加申请成功',
      };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '添加申请失败' }, ctx);
    }
  }

  //同意 好友请求
  async agree(ctx, next) {
    const applyInfo = ctx.applyInfo;
    const userCid = ctx.tokenInfo.cid;
    const friendCid = ctx.request.params.cid;
    if (applyInfo.state !== frinendTypes.APPLY_WAITING) return ctx.app.emit('error', { message: '该申请并非等待状态' }, ctx);

    try {
      const applyId = applyInfo.id;
      //* 修改为成功状态 */
      await friendService.updateApplyStateById(applyId, frinendTypes.APPLY_ACCEPTED);
      /* 添加双方好友 */
      //查询好友信息
      const [userInfo] = await userService.getUserByCid(userCid);
      const [friendInfo] = await userService.getUserByCid(friendCid);
      //互相添加
      await friendService.create(applyId, userCid, friendCid, friendInfo.name);
      await friendService.create(applyId, friendCid, userCid, userInfo.name);
      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '更改请求失败' }, ctx);
    }
  }
  //拒绝 好友请求
  async reject(ctx, next) {
    const applyInfo = ctx.applyInfo;
    if (applyInfo.state !== frinendTypes.APPLY_WAITING) return ctx.app.emit('error', { message: '该申请并非等待状态' }, ctx);

    try {
      const applyId = applyInfo.id;
      //修改为失败状态
      await friendService.updateApplyStateById(applyId, frinendTypes.APPLY_REJECTED);
      ctx.body = { status: 200, message: '修改成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '更改请求失败' }, ctx);
    }
  }

  //查询单个好友信息
  async getFriendInfo(ctx, next) {
    try {
      const friendInfo = ctx.friendInfo;
      ctx.body = { status: 200, friendInfo, message: '请求成功' };
    } catch (error) {
      console.log(error);
    }
  }

  //删除好友
  async deleteFriend(ctx, next) {
    try {
      const friendCid = ctx.request.params.cid;
      const cid = ctx.tokenInfo.cid;
      await friendService.removeFriend(cid, friendCid);
      ctx.body = { status: 200, message: '删除成功' };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '删除好友失败' }, ctx);
    }
  }
}

module.exports = new FriendCotroller();
