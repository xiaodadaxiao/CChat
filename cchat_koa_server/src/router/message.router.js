const Router = require('koa-router');
const messageController = require('../controller/message.controller');
const authMiddleware = require('../middleware/auth.middleware');
const friendMiddleware = require('../middleware/friend.middleware');
const memberMiddleware = require('../middleware/member.middleware');
const messageRouter = new Router({ prefix: '/message' });

messageRouter.get(
  '/index',
  authMiddleware.checkToken, //检查token
  messageController.getIndexMessage
);

//获取好友聊天信息
messageRouter.get(
  '/friend/:cid',
  authMiddleware.checkToken,
  friendMiddleware.checkFriend, //检查是否是好友
  messageController.getFriendMessage
);

//获取群聊天信息
messageRouter.get(
  '/group/:gid',
  authMiddleware.checkToken,
  memberMiddleware.checkInsideByParamGid, //检查是否在群里
  messageController.getGroupMessage
);

module.exports = messageRouter;
