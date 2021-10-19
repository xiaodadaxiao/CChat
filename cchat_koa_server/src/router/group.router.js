/* 群相关接口 */
const Router = require('koa-router');

const groupController = require('../controller/group.controller');

const authMiddleware = require('../middleware/auth.middleware');
const groupMiddleware = require('../middleware/group.middleware');
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

module.exports = groupRouter;
