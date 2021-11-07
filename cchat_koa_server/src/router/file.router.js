const Router = require('koa-router');
const authMiddleware = require('../middleware/auth.middleware');
const fileController = require('../controller/file.controller');
const fileMiddleware = require('../middleware/file.middleware');
const memberMiddleware = require('../middleware/member.middleware');
const groupMiddleware = require('../middleware/group.middleware');
const fileRouter = new Router({ prefix: '/upload' });

//上传图片
fileRouter.post(
  '/image',
  authMiddleware.checkToken, //检查token
  fileMiddleware.uploadImage,
  fileController.uploadImage
);
fileRouter.post(
  '/avatar',
  authMiddleware.checkToken, //检查token
  fileMiddleware.uploadAvatar,
  fileController.uploadUserAvatar
);
fileRouter.post(
  '/group/:gid',
  authMiddleware.checkToken, //检查token
  memberMiddleware.checkInsideByParamGid, //检查是否在群
  groupMiddleware.checkAdmin, //检查权限
  fileMiddleware.uploadAvatar,
  fileController.uploadGroupAvatar
);
//得到图片
fileRouter.get('/:filetype/:filename', fileController.getImage);

module.exports = fileRouter;
