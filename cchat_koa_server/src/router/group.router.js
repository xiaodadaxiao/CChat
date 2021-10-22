/* 群相关接口 */
const Router = require('koa-router');

const groupController = require('../controller/group.controller');

const authMiddleware = require('../middleware/auth.middleware');
const groupMiddleware = require('../middleware/group.middleware');
const memberMiddleware = require('../middleware/member.middleware');
const groupRouter = new Router({ prefix: '/group' });

groupRouter.get(
  '/info/:gid',
  authMiddleware.checkToken, //检查token
  groupMiddleware.checkParamGid, //检查群信息
  groupController.getInfo
);

//搜索群
groupRouter.get(
  '/search/:gid',
  groupMiddleware.checkParamGid, //检查群信息
  groupController.search
);

//修改群名称
groupRouter.patch(
  '/:gid/gname',
  authMiddleware.checkToken, //检查token
  groupMiddleware.checkParamGid, //检查群信息
  memberMiddleware.checkInsideByParamGid, //检查用户是否在群中
  groupMiddleware.checkAdmin, //检查群权限
  groupController.updateGname
);
//修改群简介
groupRouter.patch(
  '/:gid/notice',
  authMiddleware.checkToken, //检查token
  groupMiddleware.checkParamGid, //检查群信息
  memberMiddleware.checkInsideByParamGid, //检查用户是否在群中
  groupMiddleware.checkAdmin, //检查群权限
  groupController.updateNotice
);

//添加群邀请
groupRouter.post(
  '/:gid/invite',
  authMiddleware.checkToken, //检查token
  groupMiddleware.checkParamGid, //检查群信息
  memberMiddleware.checkInsideByParamGid, //检查邀请者是否在群中
  groupController.addInvite
);

//申请入群
groupRouter.post(
  '/:gid/apply',
  authMiddleware.checkToken, //检查token
  groupMiddleware.checkParamGid, //检查群信息
  groupController.apply
);
//得到群申请列表
groupRouter.get(
  '/applylist',
  authMiddleware.checkToken, //检查token
  groupController.getApplyList
);
//得到群与好友列表相关信息
groupRouter.get(
  '/:gid/friend',
  authMiddleware.checkToken, //检查token
  groupMiddleware.checkParamGid, //检查群信息
  memberMiddleware.checkInsideByParamGid, //检查是否在群
  groupController.getFriendByGroup
);

//同意群请求
groupRouter.patch(
  '/:gid/apply/:inviteecid/agree',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid,
  groupMiddleware.checkAdmin, //检查群权限
  groupController.agreeApply
);

//拒绝群申请
groupRouter.patch(
  '/:gid/apply/:inviteecid/reject',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid,
  groupMiddleware.checkAdmin, //检查群权限
  groupController.rejectApply
);

//创建群聊
groupRouter.post(
  '/create',
  authMiddleware.checkToken, //检查token

  groupController.create
);
//解散群聊
groupRouter.delete(
  '/:gid',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid,
  groupMiddleware.checkAdmin, //检查群权限
  groupController.remove
);
module.exports = groupRouter;
