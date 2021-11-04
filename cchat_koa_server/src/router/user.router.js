const Router = require('koa-router');
const userController = require('../controller/user.controller');
const userMiddleware = require('../middleware/user.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const userRouter = new Router({ prefix: '/user' });

//搜索用户
userRouter.get(
  '/search/:cid',
  userMiddleware.checkParamsCid, //检查用户是否存在
  userController.search
);

//查询用户信息
userRouter.get(
  '/info/:cid',
  authMiddleware.checkToken, //检查token
  userMiddleware.checkParamsCid, //检查cid
  userController.getUserInfo
);

//修改昵称
userRouter.patch(
  '/name/:name',
  authMiddleware.checkToken, //检查token
  userController.updateName
);
//修改签名
userRouter.patch(
  '/signature/:signature',
  authMiddleware.checkToken, //检查token
  userController.updateSignature
);
//修改密码
userRouter.patch(
  '/password',
  authMiddleware.checkToken, //检查token
  userController.updatePassword
);

module.exports = userRouter;
