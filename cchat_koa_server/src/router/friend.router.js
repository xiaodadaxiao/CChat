const Router = require('koa-router');

const friendController = require('../controller/friend.controller');
const authMiddleware = require('../middleware/auth.middleware');
const userMiddleware = require('../middleware/user.middleware');
const friendMiddleware = require('../middleware/friend.middleware');
const friendRouter = new Router({ prefix: '/friend' });

//获得好友列表
friendRouter.get(
  '/list',
  authMiddleware.checkToken, //检查token
  friendController.getList
);
//添加好友申请
friendRouter.post(
  '/apply/:cid',
  authMiddleware.checkToken, //检查token,
  userMiddleware.checkParamsCid, //检查用户是否存在
  friendController.createApply
);
//获得好友请求列表
friendRouter.get(
  '/apply',
  authMiddleware.checkToken, //检查token
  friendController.getApplyList
);
//同意 添加好友请求
friendRouter.post(
  '/agree/:cid',
  authMiddleware.checkToken, //检查token
  friendMiddleware.checkApplyParamsToToken, //检查申请信息
  friendController.agree
);
//拒绝 添加好友请求
friendRouter.post(
  '/reject/:cid',
  authMiddleware.checkToken, //检查token
  friendMiddleware.checkApplyParamsToToken, //检查申请信息
  friendController.reject
);

//获取好友信息
friendRouter.get(
  '/:cid/info',
  authMiddleware.checkToken, //检查token
  friendMiddleware.checkFriend, //检查是否是好友
  friendController.getFriendInfo
);

//删除好友
friendRouter.delete(
  '/:cid',
  authMiddleware.checkToken,
  friendMiddleware.checkFriend, //是否是好友
  friendController.deleteFriend
);

//修改好友备注
friendRouter.patch(
  '/:cid/nickname',
  authMiddleware.checkToken,
  friendMiddleware.checkFriend, //是否是好友
  friendController.updateNickname
);
//好友加入黑名单
friendRouter.post(
  '/:cid/backlist',
  authMiddleware.checkToken,
  friendMiddleware.checkFriend, //是否是好友
  friendController.addBackList
);
//好友移出黑名单
friendRouter.delete(
  '/:cid/backlist',
  authMiddleware.checkToken,
  friendMiddleware.checkFriend, //是否是好友
  friendController.removeBackList
);

//得到好友黑名单列表
friendRouter.get(
  '/backlist',
  authMiddleware.checkToken, //检查token
  friendController.getBackList
);

module.exports = friendRouter;
