/* 群-成员 相关接口 */
const Router = require('koa-router');
const memberContoller = require('../controller/member.contoller');
const memberController = require('../controller/member.contoller');
const authMiddleware = require('../middleware/auth.middleware');
const groupMiddleware = require('../middleware/group.middleware');
const memberMiddleware = require('../middleware/member.middleware');
const memberRouter = new Router({ prefix: '/member' });

//获取群成员
memberRouter.get(
  '/list/:gid',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid, //检查是否在群聊成员中
  memberController.getList
);

//修改昵称
memberRouter.patch(
  '/nickname/:gid',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid, //检查是否在群聊成员中
  memberContoller.changeNickname
);
//修改接收通知
memberRouter.patch(
  '/remind/:gid',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid, //检查是否在群聊成员中
  memberContoller.changeRemind
);
//获取用户的群聊
memberRouter.get(
  '/list',
  authMiddleware.checkToken, //检查token
  memberContoller.getGroupList
);

//移除用户
memberRouter.delete(
  '/:gid/user/:cid',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid, //检查操作员是否在群聊
  groupMiddleware.checkAdmin, //检查操作权限
  memberContoller.removeUser
);

//退出群聊
memberRouter.delete(
  '/quit/:gid',
  authMiddleware.checkToken, //检查token
  groupMiddleware.checkParamGid, //检查群信息
  memberMiddleware.checkInsideByParamGid, //检查操作员是否在群聊
  memberContoller.quit
);
module.exports = memberRouter;
